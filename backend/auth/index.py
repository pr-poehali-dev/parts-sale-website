import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor
import bcrypt
import jwt
from datetime import datetime, timedelta

def handler(event: dict, context) -> dict:
    '''API для регистрации и авторизации пользователей'''
    
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Authorization'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    try:
        body = json.loads(event.get('body', '{}'))
        action = body.get('action')
        
        conn = psycopg2.connect(os.environ['DATABASE_URL'])
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        if action == 'register':
            email = body.get('email')
            password = body.get('password')
            name = body.get('name')
            phone = body.get('phone', '')
            city = body.get('city', '')
            
            if not email or not password or not name:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Email, password и name обязательны'}),
                    'isBase64Encoded': False
                }
            
            cur.execute("SELECT id FROM users WHERE email = %s", (email,))
            if cur.fetchone():
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Пользователь с таким email уже существует'}),
                    'isBase64Encoded': False
                }
            
            password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
            
            cur.execute(
                "INSERT INTO users (email, password_hash, name, phone, city) VALUES (%s, %s, %s, %s, %s) RETURNING id, email, name, city",
                (email, password_hash, name, phone, city)
            )
            user = cur.fetchone()
            conn.commit()
            
            token = jwt.encode({
                'user_id': user['id'],
                'email': user['email'],
                'exp': datetime.utcnow() + timedelta(days=30)
            }, os.environ.get('JWT_SECRET', 'default-secret'), algorithm='HS256')
            
            cur.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({
                    'token': token,
                    'user': {
                        'id': user['id'],
                        'email': user['email'],
                        'name': user['name'],
                        'city': user['city']
                    }
                }),
                'isBase64Encoded': False
            }
        
        elif action == 'login':
            email = body.get('email')
            password = body.get('password')
            
            if not email or not password:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Email и password обязательны'}),
                    'isBase64Encoded': False
                }
            
            cur.execute("SELECT id, email, password_hash, name, city FROM users WHERE email = %s", (email,))
            user = cur.fetchone()
            
            if not user or not bcrypt.checkpw(password.encode('utf-8'), user['password_hash'].encode('utf-8')):
                return {
                    'statusCode': 401,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Неверный email или пароль'}),
                    'isBase64Encoded': False
                }
            
            token = jwt.encode({
                'user_id': user['id'],
                'email': user['email'],
                'exp': datetime.utcnow() + timedelta(days=30)
            }, os.environ.get('JWT_SECRET', 'default-secret'), algorithm='HS256')
            
            cur.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({
                    'token': token,
                    'user': {
                        'id': user['id'],
                        'email': user['email'],
                        'name': user['name'],
                        'city': user['city']
                    }
                }),
                'isBase64Encoded': False
            }
        
        else:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Неизвестное действие'}),
                'isBase64Encoded': False
            }
    
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)}),
            'isBase64Encoded': False
        }
