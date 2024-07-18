const menu = document.getElementById('menu')
const cartBtn = document.getElementById('cart-btn')
const cartModal = document.getElementById('cart-modal') 
const cartItemsContainer = document.getElementById('cart-items')
const cartTotal = document.getElementById('cart-total')
const checkoutBtn = document.getElementById('checkout-btn')
const closeModalBtn = document.getElementById('close-modal-btn')
const cartCounter = document.getElementById('cart-count')
const addressInput = document.getElementById('address')
const addressWarn = document.getElementById('address-warn')


let cart = []

//Abrir o modal do carrinho
cartBtn.addEventListener("click", function() {
    updateCartModal()
    cartModal.style.display = "flex"
})

//Fecha modal
cartModal.addEventListener("click", function(event) {
    if(event.target === cartModal) {
        cartModal.style.display = "none"
    }
})

closeModalBtn.addEventListener("click", function() {
    cartModal.style.display = "none"
})

//Adicionando Items
menu.addEventListener("click", function(event) {
    // console.log(event.target)

    let parentButton = event.target.closest(".add-to-cart-btn")
    
    if (parentButton) {
        const name = parentButton.getAttribute("data-name")
        const price = Number(parentButton.getAttribute("data-price"))

        //Adicionar no carrinho
        addToCart(name, price)
    }
})

// Função para adicionar ao carrinho
function addToCart(name, price) {
    const existingItem = cart.find(item => item.name === name)

    if(existingItem) {
        // Se o item já existe só aumenta a quantidade 
        existingItem.quantity += 1
    } else {
        cart.push({
            name, 
            price, 
            quantity: 1, 
        })
    }
    
    updateCartModal()
}

// Atualizar o carrinho
function updateCartModal(){
    cartItemsContainer.innerHTML = ""
    let total = 0

    cart.forEach(item => {
        const cartItemElement = document.createElement("div")
        cartItemElement.classList.add("flex", "justify-between", "mb-4", "flex-col")

        cartItemElement.innerHTML = `
            <div class="flex items-center justify-between">
                <div>
                    <p class="font-medium">${item.name}</p>
                    <p>Qtd: ${item.quantity}</p>
                    <p class="mt-2">R$ ${item.price.toFixed(2)}</p>
                </div>
                <button class="remove-btn" data-name="${item.name}">Remover</button>
            </div>
        `

        total += item.price * item.quantity

        cartItemsContainer.appendChild(cartItemElement)
    })

    cartTotal.textContent = total.toLocaleString("pt-BR", {
        style: "currency", currency: "BRL"
    })

    cartCounter.innerHTML = cart.length
}

// Função para remover um item do carrinho
cartItemsContainer.addEventListener("click", function(event) {
    if(event.target.classList.contains("remove-btn")){
        const name = event.target.getAttribute("data-name")

        removeItemCart(name)
    }
})
function removeItemCart(name) {
    const index = cart.findIndex(item => item.name === name)
    
    if(index !== -1) {
        const item = cart[index]
        console.log(item)

        if(item.quantity > 1) {
            item.quantity -= 1
            updateCartModal()
            return
        } 

        cart.splice(index, 1)
        updateCartModal()
    }
}

addressInput.addEventListener("input", function(event) {
    let inputValue = event.target.value

    if(inputValue !== "") {
        addressInput.classList.remove("border-red-500")
        addressWarn.classList.add("hidden")
    }
})

// Verificações do Input
checkoutBtn.addEventListener("click", function() {

    const isOpen = checkRestaurant()
    if (!isOpen) {
        Toastify({
            text: "Restaurante Fehcado! ",
            duration: 3000, 
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "center", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
                background: "#ef4444"
            },
        }).showToast()

        return
    }

    if(cart.length === 0) return //Carrinho vazio
    if(addressInput.value === "") { //Endereço incorreto
        addressWarn.classList.remove("hidden")
        addressInput.classList.add("border-red-500")
        return
    }

    // Enviar Pedido para API do whatsApp
    const cartItems = cart.map((item) => {
        return(
            `${item.name} Quantidade: (${item.quantity}) Preço: R$${item.price} |`
        )
    }).join("") //transformando em string o Array

    // Envidando mensagem
    const message = encodeURIComponent(cartItems)
    const phone = "14997906348"

    window.open(`https://wa.me/${phone}?text=${message} Endereço: ${addressInput.value}`, "_blank")

    // Limpando o carrinho apos realizar o pedido
    cart.length = 0
    updateCartModal() //Atualiza o carrinho
})

function checkRestaurant() {
    const data = new Date()
    const hora = data.getHours()
    return hora >= 19 && hora < 22 // restaurante aberto
}

const spanItem = document.getElementById("date-span")
const isOpen = checkRestaurant()

if (isOpen) {
    spanItem.classList.remove("bg-red-500")
    spanItem.classList.add("bg-green-600")
} else {
    spanItem.classList.add("bg-red-500")
    spanItem.classList.remove("bg-green-600")
}