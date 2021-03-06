class Main {

    cart = JSON.parse(localStorage.getItem("cart")) || [];
    id;
    name;
    price;
    image;

    async init() {
        this.products = await this.loadJSON();
        this.showProducts();
        this.showCartCount(this.getCartQuantity());
        this.cartMulti();
    }

    async loadJSON() {
        return fetch('products.json').then(response => {
            return response.json().then(resolved => {
                return resolved;
            })
        });
    }

    showProducts() {
        const container = document.getElementById("cardItems");

        this.products.forEach(product => {
            container.innerHTML += template.shopProduct(product);
        });
    }

    cartMulti() {
        const btns = document.querySelectorAll(".add-cart");

        btns.forEach(btn => {
            btn.addEventListener('click', (event) => {
                this.addToCart(event);
            })
        })
    }

    addToCart(event) {
        const element = event.target.parentElement.parentElement;
        this.id = Number(element.getAttribute("data-id"));
        this.name = element.querySelector(".item-name").innerHTML;
        this.price = Number(element.querySelector(".item-price-value").innerHTML);
        this.image = element.querySelector("img").getAttribute("src");

        if (this.inCart(this.id)) this.modifyQuantity(this.id);

        if (!this.inCart(this.id))
            this.cart.push({
                id: this.id,
                name: this.name,
                price: this.price,
                image: this.image,
                quantity: 1
            });
        localStorage.setItem("cart", JSON.stringify(this.cart));
        this.showCartCount(this.getCartQuantity());
    }

    modifyQuantity(id) {
        this.cart.map(element => {
            if (element.id === id) element.quantity++;
        })
    }

    inCart() {
        return this.cart.find(this.searchPredicate, this)
    }

    searchPredicate(element) {
        return element.id === this.id;
    }

    showCartCount(value) {
        document.getElementById("cartValue").innerHTML = `${value}`;
    }

    getCartQuantity() {
        return this.cart.reduce((accumulator, value) => {
            return accumulator + value.quantity
        }, 0)
    }

}

document.addEventListener("DOMContentLoaded", () => {
    const main = new Main();
    main.init().then(_ => _);
});