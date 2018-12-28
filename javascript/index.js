// const liSelectByBarcode = document.getElementById("barcode");
const ulBuyerSelector = document.getElementById("buyer-selection");
ulBuyerSelector.addEventListener('click', processSelection);
const divDisplaySelection = document.getElementById("option-selected");

// let spanCats;
fetchAllProducts();

function processSelection(e){
    debugger;
    console.log(e.target);
    if (e.target.innerText==="Barcode"){
        
        const inputBarcode=e.target.nextElementSibling
        // inputBarcode.addEventListener("toggle");
        inputBarcode.style.display="inline";
        inputBarcode.addEventListener('keyup', searchByBarcode)
    }else if (e.target.innerText==="Name"){
        const inputName=e.target.nextElementSibling
        inputName.style.display="inline";
        inputName.addEventListener('keyup', searchByName)
    }else if (e.target.innerText==="Vendor"){
        if (e.target.nextElementSibling){
            e.target.nextElementSibling.remove();
        }else{
            fetchVendors(e.target);
        }
    }else if (e.target.innerText==="Category"){
        if (e.target.nextElementSibling){
            e.target.nextElementSibling.remove();
        }else{
            fetchCategory(e.target);
        }
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


function fetchVendors(ele){ //ele is current target element. It is passed when clicked on search by vendor and it will be passed to createVendorSelectBox 
                            //function so that the select box can be appended into it.
    fetch('http://localhost:3000/api/v1/vendors')
        .then(res => res.json())
        .then(vendors => createVendorSelectBox(vendors, ele));
 
}


function createVendorSelectBox(vendors, ele){
    const vendorSelBox=document.createElement('select');
    for(let vendor of vendors){
        const option=document.createElement('option');
        option.value = vendor.name;
        option.innerText = vendor.name;
        vendorSelBox.append(option);
    }
    ele.parentNode.append(vendorSelBox);
    ele.style.display='inline';
    vendorSelBox.addEventListener('change', searchByVendor)
}

function fetchCategory(ele){
    fetch('http://localhost:3000/api/v1/categories')
        .then(res => res.json())
        .then(cats => createCategorySelectBox(cats, ele));
 
}

function createCategorySelectBox(cats, ele){
    const categorySelBox=document.createElement('select');
    for(let cat of cats){
        const option=document.createElement('option');
        option.value = cat.main_cat;
        option.innerText = cat.main_cat;
        categorySelBox.append(option);
    }
    ele.parentNode.append(categorySelBox);
    ele.style.display='inline';
    categorySelBox.addEventListener('change', searchByCategory);
}

function fetchAllProducts(){
    fetch('http://localhost:3000/api/v1/products')
        .then(res => res.json())
        .then(products => showAllProducts(products))
}

function showAllProducts(products){
    
    const divProduct = document.createElement('div');
    divProduct.setAttribute('class', 'all-products')
    for(let product of products){
        const divCard = document.createElement('div');
        divCard.setAttribute('class', 'product');
        const divProductDetail = document.createElement('div')
        divProductDetail.style.display="inline-block";
        let divVendors;
        const ul=document.createElement('ul')
        for(let key in product){
            if(key !== 'id' && key !=='img_url' && key!=='vendor_products'){
                let li = document.createElement('li');
                li.innerHTML=`<p>${key}: <span class=${key}> ${product[key]}</span></p>`
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
        divProduct.appendChild(divCard);
    }
    divDisplaySelection.innerHTML="";
    divDisplaySelection.append(divProduct);
    divDisplaySelection.style.display = "block";
    
    //store fresh array of dom elements for search function
        // spanCats=document.querySelectorAll('.category_type');   
        // console.log(spanCats); 

}


function showVendorDetail(vendorDetail){
    const div = document.createElement('div');
    for(let vendor of vendorDetail){
        const ul=document.createElement('ul');
        ul.setAttribute('name', vendor.vendor_name)
        ul.setAttribute('class', 'vendor')
        
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


//Search functions--------------Search By Barcode
function searchByBarcode(e){
    let searchBarcode=e.target.value;
    let spanBarcodes=document.querySelectorAll(".barcode");
    spanBarcodes.forEach(function(spanBar){
        let parentDiv=spanBar.parentNode.parentNode.parentNode.parentNode.parentNode;
        if(spanBar.innerText.startsWith(searchBarcode)){
            parentDiv.style.display='block';
        }else{
            parentDiv.style.display='none';
        }
    })
}


///Search By Name-------------
function searchByName(e){
    let searchName=e.target.value;
    let spanNames=document.querySelectorAll(".name");
    spanNames.forEach(function(spanName){
        let parentDiv=spanName.parentNode.parentNode.parentNode.parentNode.parentNode;
        if(spanName.innerText.toLowerCase().includes(searchName.toLowerCase())){
            parentDiv.style.display='block';
            
        }else{
            parentDiv.style.display='none';
        }
    })
}


///Search By Vendor

function searchByVendor(e){
    let vendor=e.target.value;
    const ulVendors=document.querySelectorAll('.vendor');
    console.log(ulVendors);
    ulVendors.forEach(function(ulVendor){
        let parentDiv=ulVendor.parentNode.parentNode
        if(ulVendor.getAttribute('name')===vendor){
            
            parentDiv.style.display='block';
        }else{
            parentDiv.style.display='none';
        }

    })
}

//Search By Category

function searchByCategory(e){
    let cat=e.target.value;
    const spanCats=document.querySelectorAll('.category_type');
    spanCats.forEach(function(spanCat){
        let parentDiv=spanCat.parentNode.parentNode.parentNode.parentNode.parentNode;
        parentDiv.style.display='block';
        if(spanCat.innerText===cat){
            parentDiv.style.display='block';
        }else{
            
            parentDiv.style.display='none';
        }

    })
}



