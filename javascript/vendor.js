$(function(){

    
    let loginType; 
    let baseUrl='http://localhost:3000/api/v1/';
    function createTag(tagName){
        return document.createElement(tagName);
    }

    /////login Js script -------start here ----------
    $("#login-button").click(function(){
        $(this).fadeOut();
        $("#signup-button").fadeOut();
        $("#login-type").fadeIn();
    })

    $("#buyer").click(function(){
        loginType="buyer";
        $("#login-type").fadeOut();
        $(".container").fadeIn();
    })

    $("#whlsr").click(function(){
        loginType="vendor"
        $("#login-type").fadeOut();
        $(".container").fadeIn();
    
    })

    $(".login-form").submit(function(){
        event.preventDefault();
        let username=this.user.value;
        let email=this.email.value;
        console.log(username);
        console.log(email);
        // debugger;
        if(loginType==='buyer'){
            
            //fetch get buyer tables and verify if user exist
            //if user exist, hide vendor div and show buyer div, hide login div as well
            fetchData('http://localhost:3000/api/v1/buyers')
                .then((buyers)=>{
                    let accountFound=false;
                    for(let buyer of buyers){
                        if(buyer.username===username && buyer.email===email){
                            $("#login").hide();
                            $("#buyer-page").show();
                            accountFound=true;
                            loadBuyerScript();
                            break;
                        }
                    }
                    
                    if(!accountFound){
                            alert("Sorry, no account was found with that username and email! Please enter the correct credential.")
                    }
                    
            })

        }else{
            //fetch get wholesale tables and verify if user exist
            //if user exist, hide buyer div and show vendor div
            fetchData('http://localhost:3000/api/v1/vendors')
                .then((vendors)=>{
                    let accountFound=false;
                    for(vendor of vendors){
                        if(vendor.username===username && vendor.email===email){
                            $('div[name="main"]').attr('id', vendor.id);
                            // console.log(vendor.id);
                            $("#login").hide();
                            $("#vendor").show();
                            accountFound=true;
                            loadVendorScript();
                            break;
                        }
                    }

                    if(!accountFound){
                        alert("Sorry, no account was found with that username and email! Please enter the correct credential.")
                }
                
                })
        }
    })


    //form validation
    $('.login-form').validate({ // initialize the plugin
        rules: {
            user: {
                required: true,
                minlength: 4
            },
            email: {
                required: true,
                email: true
                
            }
        }
    });

    async function fetchData (url) {
        try {
          const resp = await fetch(url)
          return resp.json();
        } catch (err) {
             alert(err);
          }
     }
  

/////login Js script -------ends here ----------




////Buyers Js script -------- start here ---------

function loadBuyerScript(){
    //from buyers page
    // const ulBuyerSelector = document.getElementById("buyer-selection");
    // ulBuyerSelector.addEventListener('click', processSelection);
    const divDisplaySelection = document.getElementById("option-selected");


    fetchData(baseUrl+'products')
        .then((products)=>showAllProducts(products));


// function processSelection(e){
    $("#buyer-selection").click(function(e){
        
    if (e.target.innerText==="Barcode"){

        const inputBarcode=e.target.nextElementSibling
        $(inputBarcode).toggle('slow', ()=>{
            // let e = $.Event('keyup');
            // e.which = 8; // Character 'backspace'
            // // debugger;
            // if($(inputBarcode).is(':hidden')){
            //     while(inputBarcode.value!==''){

            //         $(inputBarcode).trigger(e);
            //     }
            // }

            inputBarcode.value='';
            inputBarcode.addEventListener('keyup', searchByBarcode)
        });
        // inputBarcode.style.display="inline";

    }else if (e.target.innerText==="Name"){
        const inputName=e.target.nextElementSibling
        // inputName.style.display="inline";
        $(inputName).toggle(800);
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
})



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
    // ele.style.display='inline';
    $(ele).fadeIn('slow');
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
    // ele.style.display='inline';
    $(ele).fadeIn();
    categorySelBox.addEventListener('change', searchByCategory);
}


function showAllProducts(products){
    
    const divProduct = createTag('div');
    divProduct.setAttribute('class', 'all-products')
    for(let product of products){
        const divCard = createTag('div');
        divCard.setAttribute('class', 'product');
        const divProductDetail = createTag('div')
        divProductDetail.setAttribute('class', 'product-detail-div')
        divProductDetail.style.display="inline-block";
        let divVendors;
        const ul=createTag('ul')
        for(let key in product){
            if(key !== 'id' && key !=='img_url' && key!=='vendor_products'){
                let li = document.createElement('li');
                li.innerHTML=`<p><strong>${key}</strong>: <span class=${key}> ${product[key]}</span></p>`
                ul.append(li);
            }
            if (key === 'vendor_products'){
                divVendors=showVendorDetail(product[key]);
                divVendors.style.display="inline-block";

            }

         
        }
        divProductDetail.append(ul);
        
        const divImg = createTag('div');
        divImg.setAttribute('class', 'image-div')
        divImg.style.display="inline-block";
        divImg.innerHTML=`<img src=${product.img_url} width="140px" height="180px";>`
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
    const div = createTag('div');
    div.setAttribute('class', 'vendor-list-div')
    for(let vendor of vendorDetail){
        const ul=document.createElement('ul');
        // debugger;
        ul.setAttribute('name', vendor.vendor_name)
        ul.setAttribute('class', 'vendor')
        
        ul.style.display="inline-block";
        for(let key in vendor){
            if(key !=='id' && key!=='vendor_id'){
                let li=document.createElement('li');
                li.innerHTML=`<p><strong>${key}</strong>:  ${vendor[key]}</p>`
                ul.append(li);
            }
        }
        const orderButton=document.createElement('button');
        orderButton.innerText="Order";
        ul.append(orderButton);
        div.append(ul);
    }
    // console.log(div.hasChildNodes());
    return div;
}


//Search functions--------------Search By Barcode
function searchByBarcode(e){
    let searchBarcode=e.target.value;
    let spanBarcodes=document.querySelectorAll(".barcode");
    spanBarcodes.forEach(function(spanBar){
        // debugger;
        let parentDiv=spanBar.parentNode.parentNode.parentNode.parentNode.parentNode;
        if(spanBar.innerText.trim().startsWith(searchBarcode)){
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
    // const ulVendors=document.querySelectorAll('.vendor');
    const ulVendors=document.querySelectorAll(`[name="${true}"]`);
    console.log(ulVendors);
    ulVendors.forEach(function(ulVendor){
        let parentDiv=ulVendor.parentNode.parentNode
        if(ulVendor.getAttribute('name')===vendor){
            console.log(ulVendor.name);
            console.log(vendor);
            parentDiv.style.display='block';
            // console.log(parentDiv);
        }else{
            console.log(ulVendor.name);
            console.log(vendor);
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
}

////Buyers Js script --------- ends here --------





//////Vendors Js script --------- start here -------

function loadVendorScript(){
//from vendors page
const divMain=document.getElementsByName('main')[0];
console.log(divMain);
const divVendorInfo = document.getElementById('vendor-info');
const divProductDetail=document.getElementById('all-product');
const tableProduct=document.getElementById('product-table');
const buttonAddNewBtn=document.getElementById('add-product');
const errorMsg=document.getElementsByClassName('error-msg')[0];
// let row;
// console.log(tableProduct);
tableProduct.addEventListener('dblclick', tableAction);
tableProduct.addEventListener('click', tableActionOnSingleClick);
buttonAddNewBtn.addEventListener('click', addNewItem);

//Base URL for api
const baseUrl=`http://localhost:3000/api/v1/`;

let vendorId=divMain.id;//hardcoded id for testing, set this id to vendor id once vendor logs in
console.log(vendorId);

fetchVendorItems(vendorId);



function fetchVendorItems(id){
    fetch(`http://localhost:3000/api/v1/vendors/${vendorId}`)
        .then(res=>res.json())
        .then(vendorDetails=>showAllVendorItems(vendorDetails))
}


function showAllVendorItems(vendorDetails){
    divVendorInfo.innerHTML=`<div class="block" style="display:inline-block"><p><strong>Name</strong>: ${vendorDetails.name}</p>`+
                            `<p><strong>Username</strong>: ${vendorDetails.username}`+
                            `<p><strong>Email</strong>: ${vendorDetails.email}`+
                            `<p><strong>Minimum set?</strong>: ${vendorDetails.has_min}`+
                            `<p><strong>Minimum Amount</strong>: ${vendorDetails.min_amount}`+
                            `</div>`


        for(let product of vendorDetails.products){
            
        let id = product.product_id
        fetch(`http://localhost:3000/api/v1/products/${id}`)
            .then(res=>res.json())
            .then(productInfo=>populateTable(productInfo, product))
        }
}

//test code function called by test1
    function populateTable(data, product){
        // console.log(data);
        // for(let key in data){
        let row = tableProduct.insertRow();
        row.setAttribute('id',product.product_id);
        row.setAttribute('data-vpid', product.id);

        let cellImage = row.insertCell();

        let cellName = row.insertCell();
        cellName.setAttribute('name', 'name')

        let cellSize = row.insertCell();
        cellSize.setAttribute('name', 'size')

        let cellBarcode = row.insertCell();
        cellBarcode.setAttribute('name', 'barcode')

        let cellBrand = row.insertCell();
        cellBrand.setAttribute('name', 'brand')

        let cellCategory = row.insertCell();
        cellCategory.setAttribute('name', 'category_id')
        
        cellImage.innerHTML = `<img src=${data.img_url} class="table-img">`
        cellName.innerText = data.name;
        cellSize.innerText = data.size;
        cellBarcode.innerText = data.barcode;
        cellBrand.innerText = data.brand;
        cellCategory.innerText = data.category_type;

        let cellVitem=row.insertCell();
        cellVitem.setAttribute('name', 'v_item')
        cellVitem.innerText=product.v_item;

        let cellPrice=row.insertCell();
        cellPrice.setAttribute('name', 'case_price')
        cellPrice.innerText=product.case_price;
        
        let cellAction=row.insertCell();
        
        let editButton=document.createElement('button');
        editButton.setAttribute('class', 'item-action')
        editButton.innerText="Edit";
        // editButton.addEventListener('click', editItem);

        //Create Update to toggle with Edit button and set to display none once created
        //make it visible once Edit button is click
        let updateButton=document.createElement('button');
        updateButton.setAttribute('class', 'item-action');
        updateButton.setAttribute('name', 'updateAll');
        updateButton.innerText="Update";
        updateButton.style.display='none';

        //Since the update button works differently, needed 2 update buttons
        let updtBtnPriceNitem=createTag('button');
        updtBtnPriceNitem.setAttribute('class', 'item-action');
        updtBtnPriceNitem.setAttribute('name', 'updatePnI');
        updtBtnPriceNitem.innerText="Update";
        updtBtnPriceNitem.style.display='none';

        let deleteBtn=document.createElement('button');
        deleteBtn.setAttribute('class', 'item-action')
        deleteBtn.innerText="Delete";
        // deleteBtn.addEventListener('click', deleteItem);

        cellAction.append(editButton);
        cellAction.append(updateButton);
        cellAction.append(updtBtnPriceNitem);
        cellAction.append(deleteBtn);

        
        
    // }
}


function tableAction(eventDblClk){
    console.log(eventDblClk.target);
    let targetEle=eventDblClk.target;
    let editCell=document.createElement('input');
    editCell.value=eventDblClk.target.innerText;
    editCell.setAttribute('type', 'text');
    editCell.setAttribute('onfocus','this.select()')
    editCell.autofocus='true';

    targetEle.innerText="";
    targetEle.append(editCell);

    editCell.addEventListener('keydown', (eventKd)=>{
        if (eventKd.key==='Enter'){
            targetEle.innerText=editCell.value;
            editCell.remove();

            // fetch(`http://localhost:3000/`)
        }
    })

 
}

function tableActionOnSingleClick(eventSingleClk){
    if(eventSingleClk.target.className==='input-cell'){
        eventSingleClk.target.style.backgroundColor='transparent';
        errorMsg.style.display='none';
    }
    console.log(eventSingleClk.target.name);

    if(eventSingleClk.target.name==='barcode'){
        // console.log("barcode filled is click");
        getAllProducts().then((allProducts)=>{//added new line
            // console.log((allProducts));
            eventSingleClk.target.addEventListener('keyup', function(e){
                lookupProductForBarcode(e, allProducts)
            });
        })//added new line
    }

    //if add button inside new cell is click
    if(eventSingleClk.target.id==='add-item'){
        addNewProduct(eventSingleClk);
    }

    if(eventSingleClk.target.name==='updatePnI'){
        // console.log("Update button P&I click");
        updatePriceAndItemNum(eventSingleClk);

    }

    if(eventSingleClk.target.innerText==='Edit'){
        
        let id=eventSingleClk.target.parentNode.parentNode.id;
        fetch(`http://localhost:3000/api/v1/products/${id}`)
            .then(res=>res.json())
            .then(prod=> editableItem(prod.vendor_products.length))    
    }

    function editableItem(vCount){
        if (vCount>1){
            highlightItemNumAndPrice(eventSingleClk);
        }else{
            highlightEditableCells(eventSingleClk);
        }
    }

}

function getCurrentRowChilds(e){
    let currentTr=e.target.parentNode.parentNode;
    let currentTrChilds=currentTr.childNodes;
    return currentTrChilds;
}

function highlightEditableCells(e){
    // console.log(e.bubbles);
    let currentTr=e.target.parentNode.parentNode;
    let currentTrChilds=currentTr.childNodes;

    // console.log(currentTrChilds);
    currentTrChilds.forEach((td,i) => {
        // console.log(i);
        if(i!==8 && i!==0){
           let editCell=document.createElement('input');
            editCell.value=td.innerText
            editCell.setAttribute('type', 'text');
            editCell.setAttribute('onfocus','this.select()')
            editCell.autofocus='true';

            td.innerText="";
            td.append(editCell);
        }
    });

    e.target.style.display='none';//hide the edit button and display update button
    e.target.nextElementSibling.style.display="inline"; //display update button

    e.target.nextElementSibling.addEventListener('click', updateData);

    // Action when vendor clicks on 'update' button
    // e is still is the event object passed when clicked on the table
    // console.log(e.target);
    function updateData(eve){
        // console.log(currentTrChilds);
        
        let currentRow=eve.target.parentNode.parentNode;
        let id=currentRow.id;
        // console.log(currentRow.data-vpid);
        let vpid=currentRow.dataset.vpid;
        console.log(vpid);
        currentRowChilds=currentRow.childNodes;

        let updateItems={};
        let vpUpdateObj={};
        // console.log(currentRowChilds);
        currentRowChilds.forEach((td,i) => {
            if(i!==8 && i!==0){
                td.innerText=td.firstChild.value;
                // console.log(td.getAttribute("name"));
                let key=td.getAttribute("name");
                if(key==='v_item' || key==='case_price'){
                    vpUpdateObj[key]=td.innerText;
                }else{

                    updateItems[key]=td.innerText;
                }
                // td.firstChild.remove();
            }
        })
        // console.log(updateItems);
        // console.log(vpUpdateObj);
        eve.target.style.display='none';//hide the update button
        eve.target.previousElementSibling.style.display='inline';//display edit button

        //fectch update--product
        fetch(`http://localhost:3000/api/v1/products/${id}`,{
            method: 'PATCH',
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify(updateItems)
        })

        //complete fetch update--product


        //fetch update ---vendor_products for price and v_item
        
        fetch(`http://localhost:3000/api/v1/vendor_products/${vpid}`,{
            method: 'PATCH',
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify(vpUpdateObj)
        })
        //end of vendor_products update

    }

}

function getProdNvenProdAttrs(){
    let attrs=["img_url", "name", "size", "barcode", "brand", "category_id", "v_item", "case_price"];
    return attrs;
}

function getProdOnlyAttrs(){
    let attrs=["img_url", "name", "size", "barcode", "brand", "case_pack", "category_id"];
    return attrs;
}


function addNewItem(){
    let row=tableProduct.insertRow();
    row.style.height="50px";
    
    getProdNvenProdAttrs().forEach(function(attr, i){
        let cell=row.insertCell();

        if(i!==9){
            let input=createTag('input');
            input.setAttribute('type', 'text');
            input.setAttribute('class','input-cell')
            input.setAttribute('name',attr)
            cell.append(input);
        }
    })

    let actionCell=row.insertCell();
    if (requiredFields()!==""){         //requiredFields functions not implemented yet
        let addBtn=createTag('button')
        addBtn.innerText='Add';
        addBtn.setAttribute('id','add-item')
        actionCell.append(addBtn);
    }
}


function requiredFields(){//need to implement this functionality, check if the fields are actually empty
    return false;
}


function getEditBox(){
    let inputPrice=createTag('input');
    // inputPrice.setAttribute('name','editPrice')
    inputPrice.style.width="60px";
    inputPrice.style.height="30px";
    
    return inputPrice;
}



function highlightItemNumAndPrice(e){
    alert("Other vendors also stock this product. So, full edit is not available. Editable cells will be highlighted.")
    let price=e.target.parentNode.previousElementSibling;
    // debugger;
    let editPrice=getEditBox();
    editPrice.setAttribute('name','editPrice')
    editPrice.value=price.innerText;
    // console.log(editPrice.value);
    price.innerText="";
    price.append(editPrice);

    let vItem=price.previousElementSibling;
    let inputItemNum=getEditBox();
    inputItemNum.setAttribute('name','editItem')
    inputItemNum.value=vItem.innerText;
    vItem.innerText="";
    vItem.append(inputItemNum);

    e.target.style.display='none';//hide the edit button and display update button
    e.target.nextElementSibling.nextElementSibling.style.display="inline"; //display update P&I button
    

}

function updatePriceAndItemNum(e){
        let currentRow=e.target.parentNode.parentNode;
        let tdPrice=e.target.parentNode.previousElementSibling;
        let tdVitem=tdPrice.previousElementSibling;
        let newPrice=document.getElementsByName('editPrice')[0];
        let newItemNum=document.getElementsByName('editItem')[0];
        
        let vpid=currentRow.dataset.vpid;
        let vpUpdateObj={v_item:newItemNum.value, case_price:newPrice.value};
        tdPrice.innerText=newPrice.value;
        tdVitem.innerText=newItemNum.value;
        newPrice.remove();
        newItemNum.remove();
        
        e.target.style.display='none';//hide the update P&I button
        e.target.previousElementSibling.previousElementSibling.style.display='inline';//display edit button

        //fetch update ---vendor_products for price and v_item
        
        fetch(`http://localhost:3000/api/v1/vendor_products/${vpid}`,{
            method: 'PATCH',
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify(vpUpdateObj)
        })
        //end of vendor_products update

    

}

//separate function to get all products---begin

async function getAllProducts () {
    try {
      const resp = await fetch(baseUrl+'products')
    //   console.log(resp)
      return resp.json();
    } catch (err) {
         console.log(err)
      }
 }



function lookupProductForBarcode(e,allProducts){
    let userUpc=e.target.value

    //On below line, .filter methods remove the null value from the array since map returns undefined for not found item
    let vendorProductsIds=Array.from(tableProduct.rows).map((row)=>Number(row.id)).filter(i=>i);
    console.log(vendorProductsIds);
    // console.log(tableProduct.rows);

    if(!userUpc){
        divVendorInfo.firstChild.nextElementSibling.remove();
        return;
    }
   
            
            if(divVendorInfo.firstChild.nextElementSibling){
                divVendorInfo.firstChild.nextElementSibling.remove();
            }
            
            let itemSelectDiv=createTag('div');
            let ul=createTag('ul');
            for(let product of allProducts){
                let strBarcode=product.barcode.toString();
                // console.log(product);
                // console.log(typeof(product.barcode));
                if(strBarcode.startsWith(userUpc)){
                    itemSelectDiv.setAttribute('id', 'item-found');
                    itemSelectDiv.setAttribute('class', 'block');
                    itemSelectDiv.style.display='inline-block';
                    
                    //do not create li for the items that this vendor already stock
                    if(!vendorProductsIds.includes(product.id)){
                        // debugger;
                        let li=createTag('li');
                        li.setAttribute('class','product-exist')
                        li.addEventListener('click',populateRow);
                        // li.dataset.currentRow=e.target.parentNode.parentNode;
                        li.dataset.id=product.id;
                        li.dataset.img=product.img_url;
                        li.dataset.name=product.name;
                        li.dataset.size=product.size;
                        li.dataset.barcode=product.barcode;
                        li.dataset.brand=product.brand;
                        li.dataset.category_type=product.category_type;
                        li.innerHTML=`<img width="30px" height="25px" src=${product.img_url}>  Name:${product.name}   Barcode:${product.barcode}`
                        ul.append(li);
                    }
                }
            }
            itemSelectDiv.append(ul);
            divVendorInfo.append(itemSelectDiv);
        
    // })

}

function populateRow(){
    let row=document.getElementsByClassName('input-cell');

    let addBtn=document.getElementById('add-item');
    addBtn.dataset.item='exist';
    addBtn.dataset.id=this.dataset.id;
    // console.log(row);
    for(let cell of row){
        if(cell.name==='img_url'){
            cell.value=this.dataset.img;
        }else if(cell.name==='name'){
            cell.value=this.dataset.name;
        }else if(cell.name==='barcode'){
            cell.value=this.dataset.barcode;
        }else if(cell.name==='size'){
            cell.value=this.dataset.size;
        }else if(cell.name==='brand'){
            cell.value=this.dataset.brand;
        }else if(cell.name==='category_id'){
            cell.value=this.dataset.category_type;
        }
    }

}


function fieldsRequired(){
    let attrs=["name", "size", "barcode", "case_price"];
    return attrs;
}



function addNewProduct(e){
    let rowCells=getCurrentRowChilds(e);
    let requiredCellsEmpty=false;
    let productExist=false;

    //new added
    let vendorPrice;
    let vItem;


    //check if the required fields are empty
    for(let cell of rowCells){
        if(fieldsRequired().includes(cell.firstChild.name) && cell.firstChild.value===''){
            cell.firstChild.style.backgroundColor="#ff8080";
            errorMsg.style.display='block';
            requiredCellsEmpty=true;
        }

        if(cell.firstChild.name=='case_price' && cell.firstChild.value!==''){
            vendorPrice=cell.firstChild.value;
        }
        
        if(cell.firstChild.name==='v_item'){
            vItem=cell.firstChild.value;
        }
    }

    if(!requiredCellsEmpty){
        // debugger;

        //if add button's dataset item value is 'exist' do fetch post to vp table
        if(e.target.dataset.item==='exist'){

            //set td innerText to the values of input boxes and remove the inputboxes
            for(let cell of rowCells){
                
                console.log(cell);
                if(cell.firstChild.name==='img_url'){
                    cell.innerHTML=`<img src=${cell.firstChild.value}`;
                }else{
                cell.innerText=cell.firstChild.value;
                }
                // cell.firstChild.remove();
            }

            fetch(`${baseUrl}vendor_products`, {
                method: 'POST',
                headers:{'Content-Type':'application/json'},
                body:JSON.stringify({
                    v_item:vItem,
                    // e.target.parentNode.previousElementSibling.previousElementSibling.firstChild.value;
                    case_price:vendorPrice,
                    product_id:e.target.dataset.id,
                    vendor_id:vendorId
                })
            })
        }else{

        //check if the product is existing product
        //if product already exists, fetch post to vendor_products table
        //if product is not existing product, fetch post both products and vendor_products tables
        getAllProducts().then((data)=>{
            let productObj={};
            let vpObj={};

            //collect user inputs from cells and build product and vp objects
            for(let cellData of rowCells){

                if(getProdOnlyAttrs().includes(cellData.firstChild.name)){
                    productObj[cellData.firstChild.name]=cellData.firstChild.value;
                }else{
                    vpObj[cellData.firstChild.name]=cellData.firstChild.value;
                }
            }
            
            //Once objects are build, check if the user entered product is a pre-existing product
            //if pre-exist, FETCH POST vp tables
            for(let product of data){
                if (product.barcode===productObj.barcode){
                    //prepare vpObj for post method
                    vpObj.product_id=product.id;
                    vpObj.vendor_id=vendorId;

                    //fetch post only to vendor_products table
                    fetch(`${baseUrl}vendor_products`, {
                        method: 'POST',
                        headers:{'Content-Type':'application/json'},
                        body:JSON.stringify(vpObj)
                    })

                    productExist=true;     
                    break;
                }

            
            }

            // Product does not exist - fetch post to both products and vp tables
            if(!productExist){

                console.log(productObj);
                //POST products table
                fetch(`${baseUrl}products`, {
                    method: 'POST',
                    headers:{'Content-Type':'application/json'},
                    body:JSON.stringify(productObj)
                }).then(function(res){
                    if(!res.ok){
                        throw Error(res.statusText);
                    }
                    console.log(res);
                }).catch(function(error){
                    alert('The following error has occurred: \n', error);
                })

     
                  
                // function postVp(justAddedProd){
                console.log(data.length);
                vpObj.product_id=data.length+1; //this will assign the next number after the length of all products but this does not work if 'delete' function
                                                // is implemented
                vpObj.vendor_id=vendorId;
                console.log(vpObj);
                //POST vendor_products table
                fetch(`${baseUrl}vendor_products`, {
                    method: 'POST',
                    headers:{'Content-Type':'application/json'},
                    body:JSON.stringify(vpObj)
                })

            }
            
        })
    }

    }
}

}

///////Vendor Js script ------- ends here ------------

});