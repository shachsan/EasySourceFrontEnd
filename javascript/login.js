$(function(){
    let loginType; 
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
  
});