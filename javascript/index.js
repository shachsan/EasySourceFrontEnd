// const liSelectByBarcode = document.getElementById("barcode");
const ulBuyerSelector = document.getElementById("buyer-selection");
ulBuyerSelector.addEventListener('click', processSelection);
const divDisplaySelection = document.getElementById("option-selected");

function processSelection(e){

    if (e.target.id==="barcode"){
        barcodeInputForm();
        divDisplaySelection.style.display = "inline-block";
    }else if (e.target.id==="all"){
        fetchAllProducts();
        divDisplaySelection.style.display = "block";
    }else if (e.target.id==="name"){
        nameInputForm();
        divDisplaySelection.style.display = "block";
    }else if (e.target.id==="vendor"){
        fetchVendors();
        divDisplaySelection.style.display = "block";
    }else if (e.target.id==="cat"){
        fetchCategory();
        divDisplaySelection.style.display = "block";
    }
}


function barcodeInputForm(){
    const bar="<form><lable for>Enter Barcode:</label><input type='text'></input>"+
    "<button>Go</button></form>"
    divDisplaySelection.innerHTML="";
    divDisplaySelection.innerHTML=bar;
}


function nameInputForm(){
    const nameForm="<form><lable for>Enter Product Name:</label><input type='text'></input>"+
    "<button>Go</button></form>"
    divDisplaySelection.innerHTML="";
    divDisplaySelection.innerHTML=nameForm;
}


function fetchVendors(){
    fetch('http://localhost:3000/api/v1/vendors')
        .then(res => res.json())
        .then(vendors => createVendorSelectBox(vendors));
 
}


function createVendorSelectBox(vendors){
    const vendorSelBox=document.createElement('select');
    for(let vendor of vendors){
        const option=document.createElement('option');
        option.value = vendor.name;
        option.innerText = vendor.name;
        vendorSelBox.append(option);
    }
    divDisplaySelection.innerHTML="";
    divDisplaySelection.append(vendorSelBox);
}

function fetchCategory(){
    fetch('http://localhost:3000/api/v1/categories')
        .then(res => res.json())
        .then(cats => createCategorySelectBox(cats));
 
}

function createCategorySelectBox(cats){
    const categorySelBox=document.createElement('select');
    for(let cat of cats){
        const option=document.createElement('option');
        option.value = cat.main_cat;
        option.innerText = cat.main_cat;
        categorySelBox.append(option);
    }
    divDisplaySelection.innerHTML="";
    divDisplaySelection.append(categorySelBox);
}

function fetchAllProducts(){
    fetch('http://localhost:3000/api/v1/products')
        .then(res => res.json())
        .then(products => showAllProducts(products))
}

function showAllProducts(products){
    
    const divProduct = document.createElement('div');
    // divProduct.setAttribute("class","card-deck")
    for(let product of products){
        const divCard = document.createElement('div');
        const divProductDetail = document.createElement('div')
        divProductDetail.style.display="inline-block";
        // divCard.setAttribute("class", "card");//uncomment for imgCard1
        // divCard.setAttribute("class", "card")//comment out for imgCard1
        // divCard.style.width = "18rem";//comment out for imgCard1
        // divCard.innerHTML = imgCard1(product.img_url);
        // divProduct.setAttribute("class", "card")
        let divVendors;
        const ul=document.createElement('ul')
        for(let key in product){
            if(key !== 'id' && key !=='img_url' && key!=='vendor_products'){
                let li = document.createElement('li');
                li.innerHTML=`<p>${key}:  ${product[key]}</p>`
                ul.append(li);
            }
            if (key === 'vendor_products'){
                divVendors=showVendorDetail(product[key]);
                divVendors.style.display="inline-block";

            }
            
        }
        divProductDetail.append(ul);
        
        const divImg = document.createElement('div');
        divImg.style.display="inline-block";
        divImg.innerHTML=`<img src=${product.img_url} class="img-thumbnail" width="200px" height="180px">`
        divCard.append(divImg);
        divCard.append(divProductDetail);
        divCard.append(divVendors);
        // let card=imgCard(product.img_url);
        // console.log(typeof(card));
        divProduct.appendChild(divCard);
    }
    divDisplaySelection.innerHTML="";
    divDisplaySelection.append(divProduct);


}


function showVendorDetail(vendorDetail){
    const div = document.createElement('div');
    for(let vendor of vendorDetail){
        const ul=document.createElement('ul');
        ul.style.display="inline-block";
        for(let key in vendor){
            if(key !=='id' && key!=='vendor_id'){
                let li=document.createElement('li');
                li.innerHTML=`<p>${key}:  ${vendor[key]}</p>`
                ul.append(li);
            }
        }
        const orderButton=document.createElement('button');
        orderButton.innerText="Order";
        ul.append(orderButton);
        div.append(ul);
    }
    return div;
}

// function imgCard(img_url){

//     const card = 
//         `<img class="card-img-top" src="${img_url}" alt="Card image cap">`+
//         '<div class="card-body">'+
//         '<p class="card-text">Some quick example text to build on the card title and make up the bulk of the card content.</p>'+
//         '</div>'
//     return card;
// }

// function imgCard1(img_url){
//    const card = 
//         `<img class="card-img-top" src="${img_url}" alt="Card image cap">`+
//         `<div class="card-body">`+
//         `<h5 class="card-title">Card title</h5>`+
//         `<p class="card-text">This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>`+
//         `</div>`+
//         `<div class="card-footer">`+
//         `<small class="text-muted">Last updated 3 mins ago</small>`+
//         `</div>`
//     return card;
// }
