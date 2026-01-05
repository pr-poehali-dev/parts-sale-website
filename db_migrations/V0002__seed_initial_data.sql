-- Добавление тестовых пользователей
INSERT INTO users (email, password_hash, name, phone, city) VALUES
('ivan@test.com', '$2b$10$abcdefghijklmnopqrstuv', 'Иван Петров', '+7 (999) 123-45-67', 'Москва'),
('anna@test.com', '$2b$10$abcdefghijklmnopqrstuv', 'Анна Смирнова', '+7 (988) 234-56-78', 'Санкт-Петербург'),
('dmitry@test.com', '$2b$10$abcdefghijklmnopqrstuv', 'Дмитрий Козлов', '+7 (977) 345-67-89', 'Новосибирск'),
('elena@test.com', '$2b$10$abcdefghijklmnopqrstuv', 'Елена Волкова', '+7 (966) 456-78-90', 'Екатеринбург'),
('alex@test.com', '$2b$10$abcdefghijklmnopqrstuv', 'Александр Попов', '+7 (955) 567-89-01', 'Казань');

-- Добавление объявлений для телефонов
INSERT INTO listings (user_id, title, description, price, category, part_type, city, image_url, in_stock) VALUES
(1, 'Экран iPhone 14 Pro OLED оригинал', 'Оригинальный OLED дисплей для iPhone 14 Pro. Отличное состояние, без битых пикселей.', 12500, 'phones', 'Экран', 'Москва', 'https://images.unsplash.com/photo-1591337676887-a217a6970a8a?w=400', true),
(2, 'Аккумулятор Samsung Galaxy S23', 'Новый аккумулятор повышенной емкости 5000 mAh для Samsung Galaxy S23.', 3200, 'phones', 'Аккумулятор', 'Санкт-Петербург', 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400', true),
(3, 'Камера iPhone 13 Pro Max основная', 'Основная камера 12MP с оптической стабилизацией. Идеальное состояние.', 8900, 'phones', 'Камера', 'Новосибирск', 'https://images.unsplash.com/photo-1616499452040-ec53f31dad3f?w=400', true),
(1, 'Плата iPhone 13 128GB', 'Материнская плата iPhone 13 на 128GB. Полностью рабочая, без iCloud.', 18500, 'phones', 'Плата', 'Москва', 'https://images.unsplash.com/photo-1616499452040-ec53f31dad3f?w=400', true),
(4, 'Корпус Xiaomi Mi 11 черный', 'Задняя крышка и рамка для Xiaomi Mi 11. Новая, в пленке.', 2100, 'phones', 'Корпус', 'Екатеринбург', 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400', true),
(2, 'Динамик Huawei P40 Pro полифонический', 'Полифонический динамик для Huawei P40 Pro. Отличное звучание.', 1200, 'phones', 'Динамик', 'Санкт-Петербург', 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400', true),
(5, 'Кнопки включения iPhone 12 Pro', 'Комплект кнопок включения и громкости для iPhone 12 Pro. Оригинал.', 800, 'phones', 'Кнопки', 'Казань', 'https://images.unsplash.com/photo-1592286927505-b0c2923f9ebb?w=400', true),
(3, 'Микрофон Samsung Note 20 Ultra', 'Микрофон для Samsung Galaxy Note 20 Ultra. Новый.', 950, 'phones', 'Микрофон', 'Новосибирск', 'https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=400', true),
(1, 'Экран OnePlus 9 Pro AMOLED', 'AMOLED экран с высокой частотой обновления 120Hz для OnePlus 9 Pro.', 9800, 'phones', 'Экран', 'Москва', 'https://images.unsplash.com/photo-1589492477829-5e65395b66cc?w=400', true),
(4, 'Аккумулятор iPhone 11 оригинал', 'Оригинальный аккумулятор для iPhone 11, емкость 3110 mAh.', 2800, 'phones', 'Аккумулятор', 'Екатеринбург', 'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=400', true);

-- Добавление объявлений для ноутбуков
INSERT INTO listings (user_id, title, description, price, category, part_type, city, image_url, in_stock) VALUES
(1, 'Экран MacBook Pro 16" Retina', 'Retina дисплей для MacBook Pro 16" 2021-2023. Оригинал Apple.', 45000, 'laptops', 'Экран', 'Москва', 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400', true),
(2, 'Аккумулятор Dell XPS 15 97Wh', 'Аккумулятор повышенной емкости 97Wh для Dell XPS 15.', 5400, 'laptops', 'Аккумулятор', 'Санкт-Петербург', 'https://images.unsplash.com/photo-1484788984921-03950022c9ef?w=400', true),
(5, 'Клавиатура Lenovo ThinkPad X1', 'Клавиатура с подсветкой для Lenovo ThinkPad X1 Carbon Gen 9.', 4200, 'laptops', 'Корпус', 'Казань', 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400', true),
(3, 'Плата ASUS ROG Strix материнская', 'Материнская плата для ASUS ROG Strix G15. Полностью рабочая.', 22000, 'laptops', 'Плата', 'Новосибирск', 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=400', true),
(4, 'Корпус HP Pavilion 15 серебро', 'Верхняя и нижняя крышка для HP Pavilion 15. Алюминий.', 3800, 'laptops', 'Корпус', 'Екатеринбург', 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400', true),
(2, 'Динамики MacBook Air M1', 'Пара динамиков для MacBook Air M1/M2. Оригинал Apple.', 3500, 'laptops', 'Динамик', 'Санкт-Петербург', 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=400', true);

-- Добавление объявлений для планшетов
INSERT INTO listings (user_id, title, description, price, category, part_type, city, image_url, in_stock) VALUES
(3, 'Камера iPad Pro 12.9" 2021', 'Основная камера 12MP с ультраширокоугольным объективом для iPad Pro.', 8500, 'tablets', 'Камера', 'Новосибирск', 'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=400', false),
(1, 'Экран Samsung Galaxy Tab S8', 'Super AMOLED дисплей 11" для Samsung Galaxy Tab S8.', 12000, 'tablets', 'Экран', 'Москва', 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400', true),
(5, 'Аккумулятор iPad Air 4 оригинал', 'Оригинальный аккумулятор Apple для iPad Air 4 поколения.', 4500, 'tablets', 'Аккумулятор', 'Казань', 'https://images.unsplash.com/photo-1585790050230-5dd28404f01a?w=400', true),
(2, 'Корпус Huawei MatePad Pro золото', 'Задняя крышка алюминиевая для Huawei MatePad Pro. Золотистый цвет.', 3200, 'tablets', 'Корпус', 'Санкт-Петербург', 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400', true),
(4, 'Кнопки iPad Pro 11 комплект', 'Кнопки громкости и включения для iPad Pro 11". Оригинал.', 1100, 'tablets', 'Кнопки', 'Екатеринбург', 'https://images.unsplash.com/photo-1585790050230-5dd28404f01a?w=400', true);

-- Добавление объявлений для смарт-часов
INSERT INTO listings (user_id, title, description, price, category, part_type, city, image_url, in_stock) VALUES
(2, 'Корпус Apple Watch Series 8 44mm', 'Алюминиевый корпус для Apple Watch Series 8. Черный цвет.', 6700, 'watches', 'Корпус', 'Санкт-Петербург', 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=400', true),
(5, 'Экран Samsung Galaxy Watch 5 Pro', 'Сапфировое стекло и AMOLED дисплей для Galaxy Watch 5 Pro.', 5200, 'watches', 'Экран', 'Казань', 'https://images.unsplash.com/photo-1617625802912-cde586faf331?w=400', true),
(1, 'Аккумулятор Xiaomi Mi Watch', 'Аккумулятор 420 mAh для Xiaomi Mi Watch. Новый.', 1400, 'watches', 'Аккумулятор', 'Москва', 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=400', true),
(3, 'Динамик Apple Watch SE', 'Динамик для Apple Watch SE. Оригинал Apple.', 1800, 'watches', 'Динамик', 'Новосибирск', 'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=400', true);

-- Добавление объявлений для наушников
INSERT INTO listings (user_id, title, description, price, category, part_type, city, image_url, in_stock) VALUES
(4, 'Динамики AirPods Pro 2 пара', 'Пара динамиков для AirPods Pro 2 поколения. Оригинал Apple.', 2900, 'headphones', 'Динамик', 'Екатеринбург', 'https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=400', true),
(1, 'Корпус Sony WH-1000XM5 черный', 'Наушники Sony WH-1000XM5 корпус с амбушюрами. Черный.', 4200, 'headphones', 'Корпус', 'Москва', 'https://images.unsplash.com/photo-1545127398-14699f92334b?w=400', true),
(2, 'Аккумулятор JBL Tune 750BTNC', 'Аккумулятор для JBL Tune 750BTNC. Емкость 820 mAh.', 1100, 'headphones', 'Аккумулятор', 'Санкт-Петербург', 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400', true),
(5, 'Микрофон AirPods Max оригинал', 'Микрофон с шумоподавлением для AirPods Max. Оригинал.', 2400, 'headphones', 'Микрофон', 'Казань', 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400', true),
(3, 'Динамик Bose QC45 левый', 'Левый динамик для Bose QuietComfort 45. Отличное качество звука.', 3100, 'headphones', 'Динамик', 'Новосибирск', 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400', true);