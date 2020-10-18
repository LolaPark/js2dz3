const API = 'https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses';

// Переделать в ДЗ не использовать fetch а Promise
let getRequest = (url) => {
  return new Promise((resolve,reject) => {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        if (xhr.status !== 200) {
          reject('Error1');
        } else {
          resolve(xhr.responseText);
        }
      } 
    };
    xhr.send();
  });
};

getRequest(`${API}/catalogData.json`)
  .then((data) => {
    console.log(data);
  })
  .catch((error) => {
    console.log(error);
  }) 

// –--------------------------------

class ProductList {
  #goods;

  constructor(container = '.products') {
    this.container = container;
    this.#goods = [];
    this._allProducts = [];

    // this._fetchGoods();
    this.#getProducts().then((data) => {
      this.#goods = [...data];
      // this.#goods = Array.from(data);
      this.#render();
      console.log(this.sum());
    });

    //console.log(this.sum());
  }

  // _fetchGoods() {
  //   getRequest(`${API}/catalogData.json`, (data) => {
  //     console.log(data);
  //     this.#goods = JSON.parse(data);
  //     this.#render();
  //     console.log(this.#goods);
  //   });
  // }

  #getProducts() {
    return fetch(`${API}/catalogData.json`)
        .then(response => response.json())
        .catch((error) => {
          console.log(error);
        });
  }

  sum() {
    return this.#goods.reduce((sum, { price }) => sum + price, 0);
  }

  #render() {
    const block = document.querySelector(this.container);

    for (let product of this.#goods) {
      const productObject = new ProductItem(product);

      this._allProducts.push(productObject);

      block.insertAdjacentHTML('beforeend', productObject.getGoodHTML());
    }
  }
}

class ProductItem {
  constructor(product, img='https://placehold.it/200x150') {
    this.title = product.product_name /*product.title*/;
    this.price = product.price;
    this.id = product.id_product /*product.id*/;
    this.img = img;
  }

  getGoodHTML() {
    return `<div class="product-item" data-id="${this.id}">
              <img src="${this.img}" alt="Some img">
              <div class="desc">
                  <h3>${this.title}</h3>
                  <p>${this.price} \u20bd</p>
                  <button class="buy-btn">Купить</button>
              </div>
            </div>`;
  }
}

class CartProductList {
  #cartgoods;

  constructor() {
    this.amount = 0;
    this.countGoods = 0;
    this.#cartgoods = [];
    this._allCartProducts = '';

    this.#getCartProducts().then((data) => {
      this.#cartgoods = [...data.contents];
      this.amount = data.amount;
      this.countGoods = data.countGoods;

      this.#render();
      console.log(this._allCartProducts);
    });
  }
  #getCartProducts() {
    return fetch(`${API}/getBasket.json`)
        .then(response => response.json())
        .catch((error) => {
          console.log(error);
        });
  }
  #render() {
    let res = 'Корзина\n';
    for (let item of this.#cartgoods) {
      const itemObject = new CartProductItem(item);
      res += itemObject.getGoodTXT();
    }
    this._allCartProducts = res;
    alert(res);
  }

  addToCart(item) {
    return fetch(`${API}/addToBasket.json`)
      .then(response => response.json())
      .catch((error) => {
        console.log(error);
      })
  }

  deleteFromCart(item) {
    return fetch(`${API}/deleteFromBasket.json`)
      .then(response => response.json())
      .catch((error) => {
        console.log(error);
      })
  }
}

class CartProductItem {
  constructor(cartItem) {
    this.title = cartItem.product_name;
    this.price = cartItem.price;
    this.id = cartItem.id_product;
    this.qnt = cartItem.quantity;
  }

  getGoodTXT() {
    return `${this.id} // ${this.title} // ${this.price} \u20bd // ${this.qnt} шт \n`;
  }
}

const list = new ProductList();
const cartlist = new CartProductList();

