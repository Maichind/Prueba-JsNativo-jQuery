/* Mind! */

$(function(){

    /* cargue masivo */
    $('#load').click(function(){

        $('.data').css({'display':'none'})
        $('#container-carga').css({'display':'flex'})
       
        /* cargue de datos */
        $('.table').css({'display':'block'})
        $('#loader').css({'display':'flex'})
        $('#load').css({'display':'none'})

        $('#tabla').ready(function(){
            $('#container-carga').show(1000).delay(3000).hide(100)
        })
        

        /* Consumiendo API *//* pagination */
        var cars = document.querySelector('#datos')
        var pages = document.querySelector('.page')
        var items = document.querySelector('#itemsperpage')
        var index = 1
        var itemperpage = 10
        
        fetch('https://carsdata.onrender.com/cars') //Link API desplegada.
            .then( res => res.json())
            .then( datos =>{
                items.onchange = trPerpage
        
                function trPerpage(){
                    itemperpage = Number(this.value)
                    displayPage(itemperpage)
                    pageGenerator(itemperpage)
                    getpagElement(itemperpage)
                }
                function displayPage(limit){
                    cars.innerHTML = ''             //Limpiar
                    for(let i=0; i<limit; i++){     //Carga de datos hasta el limite por página
                        cars.innerHTML += `
                        <tr>
                            <td><input type="checkbox"></td>
                            <td>${ datos[i].id }</td>
                            <td>${ datos[i].placa }</td>
                            <td>${ datos[i].marca }</td>
                            <td>${ datos[i].modelo }</td>
                            <td>${ datos[i].kilometraje }</td>
                            <td>${ datos[i].transmision }</td>
                            <td>${ datos[i].tipo }</td>
                            <td>${ datos[i].precio }</td>
                            <td>
                            <button class="btn-prov">
                                    <a>NUEVO</a><i class="fa-solid fa-eye"></i>
                                </button>
                            </td>
                            <td>
                                <div class="action">
                                    <select class="acciones" name="acciones">
                                        <option selected hidden>Acciones</option>
                                        <option value="edit">Editar</option>
                                        <option value="alm">Almacenar</option>
                                    </select>
                                </div>
                            </td>
                        </tr>
                        `
                    }
                }
                displayPage(itemperpage)

                /* páginas */
                function pageGenerator(pag){
                    const cant = datos.length       //Cantidad de datos
                    pages.innerHTML =`
                        <a class="prev" id="prev">&#139;</a>
                        <a class="indice">${1}</a>
                        <a>de ${cant}</a>
                        <a class="next" id="next">&#155;</a>
                    `
                    if(cant <= pag){
                        pages.style.display = 'none'
                    } else{
                        pages.style.display = 'flex'
                        const num_page = Math.ceil(cant/pag)        //cantidad de páginas
                        for(let i=1; i<=num_page; i++){             //creación de páginas
                            const li = document.createElement('li'); li.className = 'list';  //creación de elemento li - contenedor de páginas
                            const a =document.createElement('a'); a.href = '#'; a.innerText = i; //creación de elemento a dentro de li
                            a.setAttribute('data-page', i);
                            li.appendChild(a);
                            pages.insertBefore(li,pages.querySelector('#next'));
                            li.style.display='none'         //ocultar indicadores de páginas
                        }
                    }
                }
                pageGenerator(itemperpage)
                let pageLink = pages.querySelectorAll("a"); //elementos de páginas
                let lastPage =  pageLink.length - 2;
                
                function pageRunner(page, items, lastPage, active){
                    for(button of page){
                        button.onclick = e=>{
                            const page_num = e.target.getAttribute('data-page');
                            const page_mover = e.target.getAttribute('id');
                            if(page_num != null){
                                index = page_num;
                            }else{
                                if(page_mover === "next"){
                                    index++;
                                    if(index >= lastPage){
                                        index = lastPage;
                                    }
                                }else{
                                    index--;
                                    if(index <= 1){
                                        index = 1;
                                    }
                                }
                            }
                            pageMaker(index, items, active);
                        }
                    }
                }
                var pageLi = pages.querySelectorAll('.list'); pageLi[0].classList.add("active")
		        pageRunner(pageLink, itemperpage, lastPage, pageLi)

                function getpagElement(val){
                    let pagelink = pages.querySelectorAll("a")
                    let lastpage =  pagelink.length - 2
                    let pageli = pages.querySelectorAll('.list')
                    pageli[0].classList.add("active")
                    pageRunner(pagelink, val, lastpage, pageli)
                }
                
                function pageMaker(index, item_per_page, activePage){
                    const start = item_per_page * index;  //elemento inicial
                    const end  = start + item_per_page;     //elemento final
                    const current_page =  datos.slice((start - item_per_page), (end - item_per_page)); //selección de datos por página
                    cars.innerHTML = ''
                    for(let j=0; j<current_page.length; j++){  // recorre los datos y Agrega elementos por página
                        cars.innerHTML += `
                        <tr>
                            <td><input type="checkbox"></td>
                            <td>${ current_page[j].id }</td>
                            <td>${ current_page[j].placa }</td>
                            <td>${ current_page[j].marca }</td>
                            <td>${ current_page[j].modelo }</td>
                            <td>${ current_page[j].kilometraje }</td>
                            <td>${ current_page[j].transmision }</td>
                            <td>${ current_page[j].tipo }</td>
                            <td>${ current_page[j].precio }</td>
                            <td>
                            <button class="btn-prov">
                                    <a>NUEVO</a><i class="fa-solid fa-eye"></i>
                                </button>
                            </td>
                            <td>
                                <div class="action">
                                    <select class="acciones" name="acciones">
                                        <option selected >Acciones</option>
                                        <option value="pdf">PDF</option>
                                        <option value="txt">txt</option>
                                        <option value="epub">ePub</option>
                                        <option value="fb2">fb2</option>
                                        <option value="mobi">mobi</option>
                                    </select>
                                </div>
                            </td>
                        </tr>
                        `
                    }
                    Array.from(activePage).forEach((e)=>{
                        e.classList.remove("active")
                    });
                    activePage[index-1].classList.add("active")
                }
                

                /* filter and sort table */
                const search = document.querySelector('.select .search input')
                table_rows = document.querySelectorAll('tbody tr')
                table_headers = document.querySelectorAll('thead th')

                search.addEventListener('input', searchTable)
                function searchTable(){
                    table_rows.forEach((row, i) =>{
                        let tableData = row.textContent.toLowerCase(),
                        searchData = search.value
                        row.classList.toggle('hide', tableData.indexOf(searchData) < 0)
                    })
                }

                table_headers.forEach((head, i) =>{
                    let sort = true
                    head.onclick = ()=>{
                        table_headers.forEach(head => head.classList.remove('active'))
                        head.classList.add('active')

                        document.querySelectorAll('td').forEach(td => td.classList.remove('active'))
                        table_rows.forEach(row =>{
                            row.querySelectorAll('td')[i].classList.add('active')
                        })
                        head.classList.toggle('asc', sort)
                        sort = head.classList.contains('asc') ? false : true
                        sortTable(i,sort)
                    }
                })

                function sortTable(column,sort){
                    [...table_rows].sort((a,b) =>{
                        let first_row = a.querySelectorAll('td')[column].textContent.toLowerCase(),
                            second_row = b.querySelectorAll('td')[column].textContent.toLowerCase()
                        return sort ? (first_row < second_row ? 1 : -1) : (first_row < second_row ? -1 : 1)
                    })
                        .map(sorted_row => document.querySelector('tbody').appendChild(sorted_row))
                }
            })
    })


    //Attr buttons
    $('#opcion1').click(function(){
        $('#opcion1').css({'color': '#E63020', 'border-bottom': '5px solid #E63020'})
        //Attr data
        $('.data').css({'display':'flex'})
        $('.select').css({'display':'flex'})
        $('#opcion2').css({'color': '#000000', 'border-bottom': '#FFFFFF'})
        $('#opcion3').css({'color': '#000000', 'border-bottom': '#FFFFFF'})
        $('#opcion4').css({'color': '#000000', 'border-bottom': '#FFFFFF'})
        /* enable - disabled */
        $('.table').css({'display':'none',})
        $('#loader').css({'display':'none'})
        $('#load').css({'display':'block'})
    })

    $('#opcion2').click(function(){
        $('#opcion2').css({'color': '#E63020', 'border-bottom': '5px solid #E63020'})
        //Attr data
        $('.data').css({'display':'none'})
        $('.select').css({'display':'none'})
        $('#opcion1').css({'color': '#000000', 'border-bottom': '#FFFFFF'})
        $('#opcion3').css({'color': '#000000', 'border-bottom': '#FFFFFF'})
        $('#opcion4').css({'color': '#000000', 'border-bottom': '#FFFFFF'})
        /* enable - disabled */
        $('.table').css({'display':'none',})
        $('#loader').css({'display':'none'})
        $('#load').css({'display':'block'})
    })

    $('#opcion3').click(function(){
        $('#opcion3').css({'color': '#E63020', 'border-bottom': '5px solid #E63020'})
        //Attr data
        $('.data').css({'display':'none'})
        $('.select').css({'display':'none'})
        $('#opcion1').css({'color': '#000000', 'border-bottom': '#FFFFFF'})
        $('#opcion2').css({'color': '#000000', 'border-bottom': '#FFFFFF'})
        $('#opcion4').css({'color': '#000000', 'border-bottom': '#FFFFFF'})
        /* enable - disabled */
        $('.table').css({'display':'none',})
        $('#loader').css({'display':'none'})
        $('#load').css({'display':'block'})
    })

    $('#opcion4').click(function(){
        $('#opcion4').css({'color': '#E63020', 'border-bottom': '5px solid #E63020'})
        //Attr data
        $('.data').css({'display':'none'})
        $('.select').css({'display':'none'})
        $('#opcion1').css({'color': '#000000', 'border-bottom': '#FFFFFF'})
        $('#opcion2').css({'color': '#000000', 'border-bottom': '#FFFFFF'})
        $('#opcion3').css({'color': '#000000', 'border-bottom': '#FFFFFF'})
        /* enable - disabled */
        $('.table').css({'display':'none',})
        $('#loader').css({'display':'none'})
        $('#load').css({'display':'block'})
    })
});


   