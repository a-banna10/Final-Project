function setupUI(){
    const token=localStorage.getItem("token")
    const loginDiv=document.getElementById("login-div")
    const logoutDiv=document.getElementById("logout-div")
    const addBtn=document.getElementById("add-btn")
    if(token==null)
    {
        loginDiv.style.setProperty("display","flex","important")
        logoutDiv.style.setProperty("display","none","important")
        if(addBtn!=null)
        {
            addBtn.style.setProperty("display","none","important")
        }
        
       
        
    }
    else{
        loginDiv.style.setProperty("display","none","important")
        logoutDiv.style.setProperty("display","flex","important")
        if(addBtn!=null){
            addBtn.style.setProperty("display","block","important")
        }
       
        
        const user=getCurrentUser()
        document.getElementById("nav-username").innerHTML=user.username
        document.getElementById("nav-image").src=user.profile_image
    }
}

//Auth functions
function loginButtonClicked(){
    const username=document.getElementById("username-input").value
    const password=document.getElementById("password-input").value
    toggleLoader(true)
    axios.post("https://tarmeezacademy.com/api/v1/login",{
        "username":username,
        "password":password
    })
    .then((response)=>{
        localStorage.setItem("token",response.data.token)
        localStorage.setItem("user",JSON.stringify(response.data.user))
        
        const modal=document.getElementById("login-modal")
        const modalInstance=bootstrap.Modal.getInstance(modal )
        modalInstance.hide()
        showAlert("Login Successfully!","success")
        setupUI()
    })
    .catch(error=>{
        const message=error.response.data.message
        showAlert(message,"danger")
    }).finally(()=>{
        toggleLoader(false)
    })
    
    
}

function registerNewUser(){
    const name=document.getElementById("register-name-input").value
    const username=document.getElementById("register-username-input").value
    const email=document.getElementById("register-email-input").value
    const password=document.getElementById("register-password-input").value
    const image=document.getElementById("register-image-input").files[0]
    let formData=new FormData()
    formData.append("username",username)
    formData.append("password",password)
    formData.append("image",image)
    formData.append("name",name)
    formData.append("email",email)
    toggleLoader(true)
    axios.post("https://tarmeezacademy.com/api/v1/register",formData,{
        headers:{
            "Content-Type":"multipart/form-data"
        }
        
    })
    .then((response)=>{
        console.log(response)
        localStorage.setItem("token",response.data.token)
        localStorage.setItem("user",JSON.stringify(response.data.user))
        
        const modal=document.getElementById("register-modal")
        const modalInstance=bootstrap.Modal.getInstance(modal )
        modalInstance.hide()
        showAlert("New User Register Successfully!","success")
        setupUI()
    })
    .catch(error=>{
        const message=error.response.data.message
        showAlert(message,"danger")
    }).finally(()=>{
        toggleLoader(false)
    })
}

function logout(){
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    showAlert("Logout Successfully!","success")
    setupUI()
}
//
function showAlert(message,type){
    const alertPlaceholder = document.getElementById('success-alert')
    const appendAlert = (message, type) => {
        const wrapper = document.createElement('div')
        wrapper.innerHTML = [
            `<div class="alert alert-${type} alert-dismissible" role="alert">`,
            `   <div>${message}</div>`,
            '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
            '</div>'
    ].join('')

    alertPlaceholder.append(wrapper)
    }
   appendAlert(message,type)
    //hide alert//
    // setTimeout(()=>{
    //     const alert = bootstrap.Alert.getOrCreateInstance("#success-alert")
    //     alert.close()
    // },2000)
   

}

function getCurrentUser(){
    let user=null
    const storageUser=localStorage.getItem("user")
    if(storageUser!=null)
    {
        user=JSON.parse(storageUser)
    }
    return user
}

function editPost(postObj){
    let post=JSON.parse(decodeURIComponent(postObj))

    document.getElementById("post-id-input").value=post.id
    document.getElementById("post-modal-title").innerHTML="Edit Post"
    document.getElementById("post-title-input").value=post.title
    document.getElementById("post-body-input").value=post.body
    document.getElementById("submit-btn").innerHTML="Update"
    let postModal=new bootstrap.Modal(document.getElementById("post-modal"),{})
    postModal.toggle()
}

function deletePost(postObj){

    let post=JSON.parse(decodeURIComponent(postObj))
    document.getElementById("delete-post-id-input").value=post.id
    let postModal=new bootstrap.Modal(document.getElementById("delete-post-modal"),{})
    postModal.toggle()
}

function confirmDelete(){
    const postId=document.getElementById("delete-post-id-input").value
    const token=localStorage.getItem("token")
    axios.delete(`https://tarmeezacademy.com/api/v1/posts/${postId}`,{
        headers:{
                "authorization":`Bearer ${token}`
        }
    })
    .then((response)=>{
        const modal=document.getElementById("delete-post-modal")
        const modalInstance=bootstrap.Modal.getInstance(modal )
        modalInstance.hide()
        showAlert("Post Deleted Successfully!","success")
        getPosts()
        getProfilePosts()
        getUser()
    })
    .cath(error=>{
        const message=error.response.data.message
        showAlert(message,"danger")
    })
}

function profileClicked(){
    const user=getCurrentUser()
     window.location=`profile.html?userid=${user.id}`
}

function toggleLoader(show=true){
    if(show){
        document.getElementById("loader").style.visibility="visisble"
    }else{
         document.getElementById("loader").style.visibility="hidden"
    }
}