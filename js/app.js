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

const addCart = e =>{
    
    if(e.target.classList.contains('btn-primary')){

        // se devuelve la información del elemento padre del botón donde esta la información del title, precio, id
        setCarrito(e.target.parentElement);
        
    }

    //evita que se generen mas eventos del contenedor padre
    e.stopPropagation();

}

const setCarrito = item => {

    const producto = {
        title: item.querySelector('h5').textContent,
        precio:item.querySelector('p').textContent,
        id: item.querySelector('button').dataset.id,
        cantidad: 1
    }
    //Si el producto ya existe entonces se le aumenta la cantidad al presionar el botón de agregar al carrito
    if(carrito.hasOwnProperty(producto.id)){

        producto.cantidad = carrito[producto.id].cantidad + 1

    }
    
    //se hace una copia del producto
    carrito[producto.id] = {...producto}


    

    pintarCarrito();
}


 const pintarCarrito = () => {
    //para que no se sobreescriba la información
    itemsTable.innerHTML = ''
    
    Object.values(carrito).forEach(producto => {
        

        template_table_body.querySelector('th').textContent = producto.id
        template_table_body.querySelectorAll('td')[0].textContent = producto.title
        template_table_body.querySelectorAll('td')[1].textContent = producto.cantidad
        template_table_body.querySelector('.btn-info').dataset.id = producto.id;
        
        template_table_body.querySelector('.btn-danger').dataset.id = producto.id;
        template_table_body.querySelectorAll('td')[3].textContent = producto.precio * producto.cantidad
        
              
        const clone = template_table_body.cloneNode(true);
        fragment.appendChild(clone);
    })

    itemsTable.appendChild(fragment);
    //console.log(itemsTable);
    pintarFooter();

    localStorage.setItem('carrito', JSON.stringify(carrito))

 }

 const pintarFooter = () => {
 
    //para que no se sobreescriba la información
    footerTable.innerHTML = ''

    //comprueba si hay elementos dentro del objeto carrito
   // console.log(Object.keys(carrito).length);
    //Si no hay elementos dentro del objeto entonces pinta el th
    if (Object.keys(carrito).length === 0) {
        footerTable.innerHTML = `
        <th scope="row" colspan="5">Carrito vacío - comience a comprar!</th>
        `
        return
    }


    const sumaCantidades = Object.values(carrito).reduce((acc, {cantidad}) => acc + cantidad, 0)
    const totalPrecio = Object.values(carrito).reduce((acc, {precio, cantidad}) => acc + cantidad * precio, 0)

    

    template_table_footer.querySelectorAll('td')[0].textContent = sumaCantidades
    template_table_footer.querySelectorAll('td')[2].textContent = totalPrecio

    const clone = template_table_footer.cloneNode(true);
    fragment.appendChild(clone);

    footerTable.appendChild(fragment);

    const btnVaciarCarrito = document.querySelector('#vaciar-carrito');
    btnVaciarCarrito.addEventListener('click', (e) => {

        carrito = {}
        pintarCarrito();

    })

 }

 const btnsAumentarDismunuir = e =>{
    
    if(e.target.classList.contains('btn-info')){

        const producto = carrito[e.target.dataset.id];
        producto.cantidad++;
        pintarCarrito();
        
    }
    if(e.target.classList.contains('btn-danger')){

        const producto = carrito[e.target.dataset.id];
        producto.cantidad--;
        if (producto.cantidad === 0) {
            delete carrito[e.target.dataset.id];
            
            console.log('es cero');
        }else{
        
            //carrito[e.target.dataset.id] = {...producto}
        }
        pintarCarrito()
    }
    e.stopPropagation();
    
 }

