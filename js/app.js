const template_card_dinamica_productos = document.getElementById('template-card-dinamica-productos').content;
const template_table_footer = document.getElementById('template-table-footer').content;
const template_table_body = document.getElementById('template-table-body').content;
const cardProducts = document.getElementById('card-dinamica-productos')
const itemsTable = document.getElementById('items');
const footerTable = document.getElementById('footer');
const fragment = document.createDocumentFragment();
let carrito = []
//El evento DOMContentLoaded es disparado cuando el documento HTML ha sido completamente cargado y parseado
document.addEventListener('DOMContentLoaded', () =>{fetchData()

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

const addCart = e => {

    if(e.target.classList.contains('btn-primary')){
       
        const producto = {
            title: e.target.parentElement.querySelector('h5').textContent,
            precio: e.target.parentElement.querySelector('p').textContent,
            id: e.target.parentElement.querySelector('button').dataset.id,
            cantidad: 1
        } 


        const indice = carrito.findIndex((item) => item.id === producto.id);
        if (indice === -1) {
            carrito.push(producto)
        }else{
            carrito[indice].cantidad++;
        }
        
        //console.log(carrito);

    }

    //evita que se generen mas eventos del contenedor padre
    e.stopPropagation();
    pintarCarrito();

}

const pintarCarrito = () => {
    //para que no se sobreescriba la información
    itemsTable.innerHTML = ''
    
    carrito.forEach(producto => {
        

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

    //localStorage.setItem('carrito', JSON.stringify(carrito))

 }

 const pintarFooter = () => {
 
    //para que no se sobreescriba la información
    footerTable.innerHTML = ''

    //comprueba si hay elementos dentro del objeto carrito
   // console.log(Object.keys(carrito).length);
    //Si no hay elementos dentro del objeto entonces pinta el th
    if (carrito.length === 0) {
        footerTable.innerHTML = `
        <th scope="row" colspan="5">Carrito vacío - comience a comprar!</th>
        `
        return
    }


    const sumaCantidades = carrito.reduce((acc, {cantidad}) => acc + cantidad, 0)
    const totalPrecio = carrito.reduce((acc, {precio, cantidad}) => acc + cantidad * precio, 0)

    

    template_table_footer.querySelectorAll('td')[0].textContent = sumaCantidades
    template_table_footer.querySelectorAll('td')[2].textContent = totalPrecio

    const clone = template_table_footer.cloneNode(true);
    fragment.appendChild(clone);

    footerTable.appendChild(fragment);

    const btnVaciarCarrito = document.querySelector('#vaciar-carrito');
    btnVaciarCarrito.addEventListener('click', (e) => {

        carrito = []
        pintarCarrito();

    })

 }

 const btnsAumentarDismunuir = e =>{
    
    if(e.target.classList.contains('btn-info')){
        let index = e.target.dataset.id
        const producto = carrito.find((item) => item.id === index);
        producto.cantidad++;
        
        pintarCarrito();
    }
    if(e.target.classList.contains('btn-danger')){

        let index = e.target.dataset.id
        const producto = carrito.find((item) => item.id === index);
        console.log(carrito);
        producto.cantidad--;
        
        if (producto.cantidad === 0) {
            const pos = carrito.indexOf(producto)
            carrito.splice(pos, 1)
            

 
/*         if ( i !== -1 ) {
        arr.splice( i, 1 );
        } */
            
        }else{
        
            //carrito[e.target.dataset.id] = {...producto}
        }
        pintarCarrito()
    }
    e.stopPropagation();
    
 }