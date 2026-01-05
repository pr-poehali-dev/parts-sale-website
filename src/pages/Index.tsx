import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { api, type Listing, type User } from '@/lib/api';
import { russianCities } from '@/lib/cities';

const categories = [
  { id: 'phones', name: 'Телефоны', icon: 'Smartphone' },
  { id: 'tablets', name: 'Планшеты', icon: 'Tablet' },
  { id: 'laptops', name: 'Ноутбуки', icon: 'Laptop' },
  { id: 'watches', name: 'Смарт-часы', icon: 'Watch' },
  { id: 'headphones', name: 'Наушники', icon: 'Headphones' }
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

export default function Index() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedPartTypes, setSelectedPartTypes] = useState<string[]>([]);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [cart, setCart] = useState<number[]>([]);
  const [activeTab, setActiveTab] = useState('catalog');
  const [user, setUser] = useState<User | null>(null);
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
    loadListings();
  }, []);

  const loadListings = async () => {
    try {
      setLoading(true);
      const data = await api.getListings({
        category: selectedCategory || undefined,
        part_type: selectedPartTypes.length > 0 ? selectedPartTypes[0] : undefined,
        city: selectedCity || undefined,
        search: searchQuery || undefined
      });
      setListings(data);
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: error instanceof Error ? error.message : 'Не удалось загрузить объявления',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadListings();
  }, [selectedCategory, selectedPartTypes, selectedCity, searchQuery]);

  const handleAuth = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      let result;
      if (isLogin) {
        result = await api.login(email, password);
      } else {
        const name = formData.get('name') as string;
        const city = formData.get('city') as string;
        result = await api.register(email, password, name, city);
      }

      localStorage.setItem('token', result.token);
      localStorage.setItem('user', JSON.stringify(result.user));
      setUser(result.user);
      setAuthDialogOpen(false);
      toast({
        title: 'Успешно!',
        description: isLogin ? 'Вы вошли в аккаунт' : 'Регистрация завершена'
      });
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: error instanceof Error ? error.message : 'Произошла ошибка',
        variant: 'destructive'
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    toast({ title: 'Вы вышли из аккаунта' });
  };

  const filteredProducts = listings.filter(product => {
    const matchesPartType = selectedPartTypes.length === 0 || selectedPartTypes.includes(product.partType);
    return matchesPartType;
  });

  const toggleCart = (productId: number) => {
    setCart(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const cartItems = listings.filter(p => cart.includes(p.id));
  const cartTotal = cartItems.reduce((sum, item) => sum + item.price, 0);

  const togglePartType = (type: string) => {
    setSelectedPartTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const userListings = listings.filter(l => user && l.seller === user.name);

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
              {user ? (
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="hover:bg-purple-100">
                      <Icon name="User" size={20} />
                    </Button>
                  </SheetTrigger>
                  <SheetContent>
                    <SheetHeader>
                      <SheetTitle>Профиль</SheetTitle>
                    </SheetHeader>
                    <div className="mt-6 space-y-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Имя</p>
                        <p className="font-semibold">{user.name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Email</p>
                        <p className="font-semibold">{user.email}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Город</p>
                        <p className="font-semibold">{user.city || 'Не указан'}</p>
                      </div>
                      <Button onClick={handleLogout} variant="outline" className="w-full">
                        Выйти
                      </Button>
                    </div>
                  </SheetContent>
                </Sheet>
              ) : (
                <Dialog open={authDialogOpen} onOpenChange={setAuthDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="hover:bg-purple-100">
                      <Icon name="User" size={20} />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>{isLogin ? 'Вход' : 'Регистрация'}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleAuth} className="space-y-4">
                      {!isLogin && (
                        <>
                          <div>
                            <Label htmlFor="name">Имя</Label>
                            <Input id="name" name="name" required className="mt-2" />
                          </div>
                          <div>
                            <Label htmlFor="city">Город</Label>
                            <Select name="city" required>
                              <SelectTrigger className="mt-2">
                                <SelectValue placeholder="Выберите город" />
                              </SelectTrigger>
                              <SelectContent>
                                {russianCities.map(city => (
                                  <SelectItem key={city} value={city}>{city}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </>
                      )}
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" name="email" type="email" required className="mt-2" />
                      </div>
                      <div>
                        <Label htmlFor="password">Пароль</Label>
                        <Input id="password" name="password" type="password" required className="mt-2" />
                      </div>
                      <Button type="submit" className="w-full bg-gradient-to-r from-primary to-secondary">
                        {isLogin ? 'Войти' : 'Зарегистрироваться'}
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        className="w-full"
                        onClick={() => setIsLogin(!isLogin)}
                      >
                        {isLogin ? 'Нет аккаунта? Регистрация' : 'Уже есть аккаунт? Войти'}
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              )}

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
                                <img src={item.imageUrl} alt={item.title} className="w-20 h-20 object-cover rounded-lg" />
                                <div className="flex-1">
                                  <h4 className="font-semibold text-sm line-clamp-2">{item.title}</h4>
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
                Более {listings.length} объявлений от проверенных продавцов. Быстрая доставка по всей России.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button
                  size="lg"
                  variant="secondary"
                  className="bg-white text-primary hover:bg-white/90 h-12 px-8"
                  onClick={() => !user && setAuthDialogOpen(true)}
                >
                  <Icon name="Plus" size={20} className="mr-2" />
                  Добавить объявление
                </Button>
                {!user && (
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white text-white hover:bg-white/20 h-12 px-8"
                    onClick={() => {
                      setIsLogin(false);
                      setAuthDialogOpen(true);
                    }}
                  >
                    <Icon name="UserPlus" size={20} className="mr-2" />
                    Регистрация
                  </Button>
                )}
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
            {categories.map((cat, idx) => {
              const categoryCount = listings.filter(l => l.category === cat.id).length;
              return (
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
                    <p className="text-xs text-muted-foreground">{categoryCount} товаров</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        <section className="mb-6">
          <div className="flex items-center gap-3">
            <Label className="text-sm font-semibold">Город:</Label>
            <Select value={selectedCity || ''} onValueChange={(v) => setSelectedCity(v || null)}>
              <SelectTrigger className="w-64">
                <SelectValue placeholder="Все города" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Все города</SelectItem>
                {russianCities.slice(0, 20).map(city => (
                  <SelectItem key={city} value={city}>{city}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </section>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-3 mb-6">
            <TabsTrigger value="catalog">Каталог</TabsTrigger>
            <TabsTrigger value="profile" disabled={!user}>Профиль</TabsTrigger>
            <TabsTrigger value="sales" disabled={!user}>Мои продажи</TabsTrigger>
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
                  {(selectedCategory || selectedPartTypes.length > 0 || selectedCity) && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedCategory(null);
                        setSelectedPartTypes([]);
                        setSelectedCity(null);
                      }}
                    >
                      Сбросить фильтры
                    </Button>
                  )}
                </div>

                {loading ? (
                  <div className="text-center py-16">
                    <p className="text-muted-foreground">Загрузка...</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProducts.map((product, idx) => (
                      <Card
                        key={product.id}
                        className="overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1 animate-slide-up"
                        style={{ animationDelay: `${idx * 50}ms` }}
                      >
                        <div className="relative">
                          <img
                            src={product.imageUrl}
                            alt={product.title}
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
                              {product.partType}
                            </Badge>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Icon name="MapPin" size={12} />
                              <span>{product.city}</span>
                            </div>
                          </div>
                          <h3 className="font-semibold line-clamp-2 text-sm">{product.title}</h3>
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
                )}

                {!loading && filteredProducts.length === 0 && (
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
                    {user?.name.charAt(0).toUpperCase()}
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
                  <Input value={user?.email || ''} disabled className="mt-2" />
                </div>
                <div>
                  <Label>Имя</Label>
                  <Input value={user?.name || ''} disabled className="mt-2" />
                </div>
                <div>
                  <Label>Город</Label>
                  <Input value={user?.city || 'Не указан'} disabled className="mt-2" />
                </div>
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
                {userListings.length === 0 ? (
                  <div className="text-center py-12">
                    <Icon name="PackageOpen" size={64} className="mx-auto text-muted-foreground mb-4" />
                    <h4 className="text-xl font-semibold mb-2">У вас пока нет объявлений</h4>
                    <p className="text-muted-foreground mb-6">Добавьте свой первый товар и начните продавать</p>
                    <Button variant="outline" className="border-primary text-primary hover:bg-primary/10">
                      Создать объявление
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {userListings.map(listing => (
                      <Card key={listing.id}>
                        <div className="flex gap-4 p-4">
                          <img src={listing.imageUrl} alt={listing.title} className="w-24 h-24 object-cover rounded-lg" />
                          <div className="flex-1">
                            <h4 className="font-semibold">{listing.title}</h4>
                            <p className="text-sm text-muted-foreground mt-1">{listing.description}</p>
                            <div className="flex items-center gap-4 mt-2">
                              <span className="font-bold text-primary">{listing.price.toLocaleString()} ₽</span>
                              <Badge>{listing.partType}</Badge>
                              <span className="text-xs text-muted-foreground">{listing.city}</span>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
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
                {categories.map(cat => (
                  <li key={cat.id}>{cat.name}</li>
                ))}
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
