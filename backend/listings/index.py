import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor

def handler(event: dict, context) -> dict:
    '''API для получения и управления объявлениями'''
    
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Authorization'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    try:
        conn = psycopg2.connect(os.environ['DATABASE_URL'])
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        if method == 'GET':
            params = event.get('queryStringParameters') or {}
            category = params.get('category')
            part_type = params.get('part_type')
            city = params.get('city')
            search = params.get('search', '')
            
            query = """
                SELECT l.*, u.name as seller_name, u.city as seller_city
                FROM listings l
                JOIN users u ON l.user_id = u.id
                WHERE 1=1
            """
            query_params = []
            
            if category:
                query += " AND l.category = %s"
                query_params.append(category)
            
            if part_type:
                query += " AND l.part_type = %s"
                query_params.append(part_type)
            
            if city:
                query += " AND l.city = %s"
                query_params.append(city)
            
            if search:
                query += " AND (l.title ILIKE %s OR l.description ILIKE %s)"
                search_pattern = f'%{search}%'
                query_params.extend([search_pattern, search_pattern])
            
            query += " ORDER BY l.created_at DESC LIMIT 100"
            
            cur.execute(query, query_params)
            listings = cur.fetchall()
            
            result = []
            for listing in listings:
                result.append({
                    'id': listing['id'],
                    'title': listing['title'],
                    'description': listing['description'],
                    'price': listing['price'],
                    'category': listing['category'],
                    'partType': listing['part_type'],
                    'city': listing['city'],
                    'imageUrl': listing['image_url'],
                    'inStock': listing['in_stock'],
                    'views': listing['views'],
                    'seller': listing['seller_name'],
                    'sellerCity': listing['seller_city'],
                    'createdAt': listing['created_at'].isoformat() if listing['created_at'] else None
                })
            
            cur.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'listings': result}),
                'isBase64Encoded': False
            }
        
        elif method == 'POST':
            body = json.loads(event.get('body', '{}'))
            
            user_id = body.get('user_id')
            title = body.get('title')
            description = body.get('description', '')
            price = body.get('price')
            category = body.get('category')
            part_type = body.get('part_type')
            city = body.get('city')
            image_url = body.get('image_url', '')
            
            if not all([user_id, title, price, category, part_type, city]):
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Не все обязательные поля заполнены'}),
                    'isBase64Encoded': False
                }
            
            cur.execute(
                """INSERT INTO listings (user_id, title, description, price, category, part_type, city, image_url)
                   VALUES (%s, %s, %s, %s, %s, %s, %s, %s) RETURNING id""",
                (user_id, title, description, price, category, part_type, city, image_url)
            )
            listing_id = cur.fetchone()['id']
            conn.commit()
            
            cur.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'id': listing_id, 'message': 'Объявление создано'}),
                'isBase64Encoded': False
            }
        
        else:
            return {
                'statusCode': 405,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Method not allowed'}),
                'isBase64Encoded': False
            }
    
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)}),
            'isBase64Encoded': False
        }
