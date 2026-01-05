import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

const categories = [
  { id: 'phones', name: 'Телефоны', icon: 'Smartphone', count: 1250 },
  { id: 'tablets', name: 'Планшеты', icon: 'Tablet', count: 430 },
  { id: 'laptops', name: 'Ноутбуки', icon: 'Laptop', count: 820 },
  { id: 'watches', name: 'Смарт-часы', icon: 'Watch', count: 340 },
  { id: 'headphones', name: 'Наушники', icon: 'Headphones', count: 560 }
];

const partTypes = [
  'Экран',
  'Аккумулятор',
  'Камера',
  'Корпус',
  'Кнопки',
  'Динамик',
  'Микрофон',
  'Плата',
];

const mockProducts = [
  {
    id: 1,
    name: 'Экран iPhone 14 Pro OLED',
    category: 'phones',
    price: 12500,
    type: 'Экран',
    seller: 'TechParts',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1591337676887-a217a6970a8a?w=400',
    inStock: true
  },
  {
    id: 2,
    name: 'Аккумулятор Samsung Galaxy S23',
    category: 'phones',
    price: 3200,
    type: 'Аккумулятор',
    seller: 'PhoneRepair',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400',
    inStock: true
  },
  {
    id: 3,
    name: 'Экран MacBook Pro 16"',
    category: 'laptops',
    price: 45000,
    type: 'Экран',
    seller: 'AppleParts',
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400',
    inStock: true
  },
  {
    id: 4,
    name: 'Камера iPad Pro 12.9"',
    category: 'tablets',
    price: 8500,
    type: 'Камера',
    seller: 'TabletService',
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=400',
    inStock: false
  },
  {
    id: 5,
    name: 'Корпус Apple Watch Series 8',
    category: 'watches',
    price: 6700,
    type: 'Корпус',
    seller: 'WatchParts',
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=400',
    inStock: true
  },
  {
    id: 6,
    name: 'Динамики AirPods Pro 2',
    category: 'headphones',
    price: 2900,
    type: 'Динамик',
    seller: 'AudioRepair',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=400',
    inStock: true
  },
  {
    id: 7,
    name: 'Плата iPhone 13',
    category: 'phones',
    price: 18500,
    type: 'Плата',
    seller: 'TechParts',
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1616499452040-ec53f31dad3f?w=400',
    inStock: true
  },
  {
    id: 8,
    name: 'Аккумулятор Dell XPS 15',
    category: 'laptops',
    price: 5400,
    type: 'Аккумулятор',
    seller: 'LaptopService',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1484788984921-03950022c9ef?w=400',
    inStock: true
  }
];

export default function Index() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedPartTypes, setSelectedPartTypes] = useState<string[]>([]);
  const [cart, setCart] = useState<number[]>([]);
  const [activeTab, setActiveTab] = useState('catalog');

  const filteredProducts = mockProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    const matchesPartType = selectedPartTypes.length === 0 || selectedPartTypes.includes(product.type);
    return matchesSearch && matchesCategory && matchesPartType;
  });

  const toggleCart = (productId: number) => {
    setCart(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const cartItems = mockProducts.filter(p => cart.includes(p.id));
  const cartTotal = cartItems.reduce((sum, item) => sum + item.price, 0);

  const togglePartType = (type: string) => {
    setSelectedPartTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-purple-100 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-primary to-secondary p-2 rounded-xl">
                <Icon name="Wrench" className="text-white" size={28} />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  ЗапчастиМаркет
                </h1>
                <p className="text-xs text-muted-foreground">Маркетплейс запчастей</p>
              </div>
            </div>

            <div className="hidden md:flex flex-1 max-w-xl mx-8">
              <div className="relative w-full">
                <Icon name="Search" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                <Input
                  type="text"
                  placeholder="Поиск запчастей..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 h-12 border-purple-200 focus:border-primary"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="hover:bg-purple-100">
                <Icon name="User" size={20} />
              </Button>
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative hover:bg-purple-100">
                    <Icon name="ShoppingCart" size={20} />
                    {cart.length > 0 && (
                      <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-secondary">
                        {cart.length}
                      </Badge>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent className="w-full sm:max-w-lg">
                  <SheetHeader>
                    <SheetTitle>Корзина ({cart.length})</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6 space-y-4">
                    {cartItems.length === 0 ? (
                      <div className="text-center py-12">
                        <Icon name="ShoppingCart" size={48} className="mx-auto text-muted-foreground mb-4" />
                        <p className="text-muted-foreground">Корзина пуста</p>
                      </div>
                    ) : (
                      <>
                        <div className="space-y-3 max-h-[60vh] overflow-y-auto">
                          {cartItems.map(item => (
                            <Card key={item.id} className="overflow-hidden">
                              <div className="flex gap-3 p-3">
                                <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-lg" />
                                <div className="flex-1">
                                  <h4 className="font-semibold text-sm line-clamp-2">{item.name}</h4>
                                  <p className="text-xs text-muted-foreground mt-1">{item.seller}</p>
                                  <p className="font-bold text-primary mt-2">{item.price.toLocaleString()} ₽</p>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => toggleCart(item.id)}
                                  className="hover:bg-destructive/10 hover:text-destructive"
                                >
                                  <Icon name="Trash2" size={16} />
                                </Button>
                              </div>
                            </Card>
                          ))}
                        </div>
                        <div className="border-t pt-4 mt-4">
                          <div className="flex justify-between items-center mb-4">
                            <span className="text-lg font-semibold">Итого:</span>
                            <span className="text-2xl font-bold text-primary">{cartTotal.toLocaleString()} ₽</span>
                          </div>
                          <Button className="w-full h-12 text-base bg-gradient-to-r from-primary to-secondary hover:opacity-90">
                            Оформить заказ
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>

          <div className="md:hidden mt-4">
            <div className="relative">
              <Icon name="Search" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
              <Input
                type="text"
                placeholder="Поиск запчастей..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 h-12 border-purple-200"
              />
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <section className="mb-12 animate-fade-in">
          <div className="bg-gradient-to-r from-primary via-secondary to-accent rounded-3xl p-8 md:p-12 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-bold mb-4">
                Продавайте и покупайте запчасти
              </h2>
              <p className="text-lg md:text-xl text-white/90 mb-6 max-w-2xl">
                Более 3400 объявлений от проверенных продавцов. Быстрая доставка по всей России.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-white/90 h-12 px-8">
                  <Icon name="Plus" size={20} className="mr-2" />
                  Добавить объявление
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/20 h-12 px-8">
                  <Icon name="UserPlus" size={20} className="mr-2" />
                  Регистрация
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Icon name="Grid3x3" size={28} className="text-primary" />
            Категории устройств
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {categories.map((cat, idx) => (
              <Card
                key={cat.id}
                className={`cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1 animate-scale-in ${
                  selectedCategory === cat.id ? 'ring-2 ring-primary shadow-lg' : ''
                }`}
                style={{ animationDelay: `${idx * 100}ms` }}
                onClick={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
              >
                <CardContent className="p-6 text-center">
                  <div className={`mx-auto w-16 h-16 rounded-2xl flex items-center justify-center mb-3 ${
                    selectedCategory === cat.id 
                      ? 'bg-gradient-to-br from-primary to-secondary' 
                      : 'bg-purple-100'
                  }`}>
                    <Icon name={cat.icon as any} size={32} className={selectedCategory === cat.id ? 'text-white' : 'text-primary'} />
                  </div>
                  <h4 className="font-semibold text-sm mb-1">{cat.name}</h4>
                  <p className="text-xs text-muted-foreground">{cat.count} товаров</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-3 mb-6">
            <TabsTrigger value="catalog">Каталог</TabsTrigger>
            <TabsTrigger value="profile">Профиль</TabsTrigger>
            <TabsTrigger value="sales">Мои продажи</TabsTrigger>
          </TabsList>

          <TabsContent value="catalog" className="space-y-6">
            <div className="flex flex-col md:flex-row gap-6">
              <aside className="md:w-64 space-y-4">
                <Card>
                  <CardHeader>
                    <h4 className="font-semibold flex items-center gap-2">
                      <Icon name="Filter" size={18} />
                      Тип запчасти
                    </h4>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {partTypes.map(type => (
                      <div key={type} className="flex items-center space-x-2">
                        <Checkbox
                          id={type}
                          checked={selectedPartTypes.includes(type)}
                          onCheckedChange={() => togglePartType(type)}
                        />
                        <Label htmlFor={type} className="text-sm cursor-pointer">
                          {type}
                        </Label>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </aside>

              <div className="flex-1">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-muted-foreground">
                    Найдено: <span className="font-semibold text-foreground">{filteredProducts.length}</span> товаров
                  </p>
                  {(selectedCategory || selectedPartTypes.length > 0) && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedCategory(null);
                        setSelectedPartTypes([]);
                      }}
                    >
                      Сбросить фильтры
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map((product, idx) => (
                    <Card
                      key={product.id}
                      className="overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1 animate-slide-up"
                      style={{ animationDelay: `${idx * 50}ms` }}
                    >
                      <div className="relative">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-48 object-cover"
                        />
                        {!product.inStock && (
                          <Badge className="absolute top-3 right-3 bg-muted text-muted-foreground">
                            Нет в наличии
                          </Badge>
                        )}
                        {product.inStock && (
                          <Badge className="absolute top-3 right-3 bg-green-500">
                            В наличии
                          </Badge>
                        )}
                      </div>
                      <CardHeader>
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <Badge variant="outline" className="text-xs">
                            {product.type}
                          </Badge>
                          <div className="flex items-center gap-1 text-amber-500">
                            <Icon name="Star" size={14} fill="currentColor" />
                            <span className="text-xs font-semibold">{product.rating}</span>
                          </div>
                        </div>
                        <h3 className="font-semibold line-clamp-2 text-sm">{product.name}</h3>
                        <p className="text-xs text-muted-foreground mt-1">Продавец: {product.seller}</p>
                      </CardHeader>
                      <CardFooter className="flex items-center justify-between pt-0">
                        <span className="text-2xl font-bold text-primary">
                          {product.price.toLocaleString()} ₽
                        </span>
                        <Button
                          size="sm"
                          variant={cart.includes(product.id) ? "secondary" : "default"}
                          onClick={() => toggleCart(product.id)}
                          className={cart.includes(product.id) ? '' : 'bg-gradient-to-r from-primary to-secondary'}
                        >
                          <Icon name={cart.includes(product.id) ? "Check" : "ShoppingCart"} size={16} className="mr-1" />
                          {cart.includes(product.id) ? 'В корзине' : 'Купить'}
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>

                {filteredProducts.length === 0 && (
                  <div className="text-center py-16">
                    <Icon name="PackageX" size={64} className="mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Ничего не найдено</h3>
                    <p className="text-muted-foreground">Попробуйте изменить параметры поиска</p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="profile" className="py-8">
            <Card className="max-w-2xl mx-auto">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-3xl font-bold">
                    П
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">Профиль пользователя</h3>
                    <p className="text-muted-foreground">Управляйте своими данными</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Email</Label>
                  <Input placeholder="user@example.com" className="mt-2" />
                </div>
                <div>
                  <Label>Имя</Label>
                  <Input placeholder="Иван Иванов" className="mt-2" />
                </div>
                <div>
                  <Label>Телефон</Label>
                  <Input placeholder="+7 (999) 123-45-67" className="mt-2" />
                </div>
                <Button className="w-full bg-gradient-to-r from-primary to-secondary">
                  Сохранить изменения
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sales" className="py-8">
            <Card className="max-w-4xl mx-auto">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold">Мои продажи</h3>
                    <p className="text-muted-foreground">Управляйте своими объявлениями</p>
                  </div>
                  <Button className="bg-gradient-to-r from-primary to-secondary">
                    <Icon name="Plus" size={18} className="mr-2" />
                    Добавить товар
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Icon name="PackageOpen" size={64} className="mx-auto text-muted-foreground mb-4" />
                  <h4 className="text-xl font-semibold mb-2">У вас пока нет объявлений</h4>
                  <p className="text-muted-foreground mb-6">Добавьте свой первый товар и начните продавать</p>
                  <Button variant="outline" className="border-primary text-primary hover:bg-primary/10">
                    Создать объявление
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <footer className="bg-gradient-to-r from-purple-900 to-pink-900 text-white py-12 mt-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h4 className="font-bold text-lg mb-4">ЗапчастиМаркет</h4>
              <p className="text-white/80 text-sm">
                Маркетплейс запчастей для электроники. Покупайте и продавайте безопасно.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Категории</h4>
              <ul className="space-y-2 text-sm text-white/80">
                <li>Телефоны</li>
                <li>Планшеты</li>
                <li>Ноутбуки</li>
                <li>Смарт-часы</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Помощь</h4>
              <ul className="space-y-2 text-sm text-white/80">
                <li>Как продавать</li>
                <li>Как покупать</li>
                <li>Доставка</li>
                <li>Гарантия</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Контакты</h4>
              <div className="space-y-2 text-sm text-white/80">
                <p className="flex items-center gap-2">
                  <Icon name="Mail" size={16} />
                  info@zapchasti.market
                </p>
                <p className="flex items-center gap-2">
                  <Icon name="Phone" size={16} />
                  +7 (800) 555-35-35
                </p>
              </div>
            </div>
          </div>
          <div className="border-t border-white/20 mt-8 pt-8 text-center text-sm text-white/60">
            © 2026 ЗапчастиМаркет. Все права защищены.
          </div>
        </div>
      </footer>
    </div>
  );
}
