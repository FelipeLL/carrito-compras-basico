const template_card_dinamica_productos = document.getElementById('template-card-dinamica-productos').content;
const template_table_footer = document.getElementById('template-table-footer').content;
const template_table_body = document.getElementById('template-table-body').content;
const cardProducts = document.getElementById('card-dinamica-productos')
const itemsTable = document.getElementById('items');
const footerTable = document.getElementById('footer');
const fragment = document.createDocumentFragment();
let carrito = {}
//El evento DOMContentLoaded es disparado cuando el documento HTML ha sido completamente cargado y parseado
document.addEventListener('DOMContentLoaded', () =>{fetchData()
if (localStorage.getItem('carrito')) {
    carrito = JSON.parse(localStorage.getItem('carrito'))
    pintarCarrito();
}
});
cardProducts.addEventListener('click', (e) => {addCart(e)})
itemsTable.addEventListener('click', e =>{btnsAumentarDismunuir(e)})

// Traer productos de la api.json
const fetchData = async () => {

    try {
        
        const res = await fetch('api.json');
        const data = await res.json()
        
        pintarCards(data);
    } catch (error) {
        console.log(error);
    }

}

//Pintar las cards
pintarCards = (data) => {

    data.forEach(item => {
        
        template_card_dinamica_productos.querySelector('h5').textContent = item.title;
        template_card_dinamica_productos.querySelector('p').textContent = item.precio;
        template_card_dinamica_productos.querySelector('img').setAttribute('src', item.thumbnailUrl)
        template_card_dinamica_productos.querySelector('button').dataset.id = item.id;
        const clone = template_card_dinamica_productos.cloneNode(true);
        fragment.appendChild(clone);


    })

    cardProducts.appendChild(fragment);


}



