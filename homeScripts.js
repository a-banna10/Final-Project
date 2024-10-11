let currentPage=1
let lastPage=1

//infinite scroll
window.addEventListener("scroll",function(){
    const endOfPage=window.innerHeight+window.scrollY>=document.body.scrollHeight 
    if(endOfPage && currentPage<lastPage){
        currentPage=currentPage+1
        getPosts(false,currentPage)   
    }
})

setupUI()
getPosts()

function getPosts(reload=true,page=1){
    toggleLoader(true)
    axios.get(`https://tarmeezacademy.com/api/v1/posts?limit=6&page=${page}`)
    .then(function (response){
        toggleLoader(false)
        const posts=response.data.data 
        lastPage=response.data.meta.last_page
        if(reload){
            document.getElementById("posts").innerHTML=""
        }
    
        for(post of posts){
                let postTitle=""

                //edit button
                let user=getCurrentUser()
                let isMyPost=user!=null && post.author.id==user.id
                let editBtnContent=``
                let deleteBtnContent=``
                if(isMyPost)
                {
                    editBtnContent= `
                                    <button class="btn btn-outline-danger d-flex justify-content-center " style="margin-left:5px;float:right;width: 40px;height:40px;border-radius: 50%;line-height: 0;" onclick="deletePost('${encodeURIComponent(JSON.stringify(post))}')">
                                        <span class="material-symbols-outlined">
                                            delete
                                        </span>
                                    </button>
                                    <button class="btn btn-outline-secondary d-flex justify-content-center" style="float:right;width: 40px;height:40px;border-radius: 50%;line-height:0" onclick="editPost('${encodeURIComponent(JSON.stringify(post))}')">
                                        <span class="material-symbols-outlined">
                                            edit
                                        </span>
                                    </button>`
                    
                                    
                    
                }
               
                if(post.title!=null){
                    postTitle=post.title
                }
                let content=`
                        <div class="card shadow" data-bs-theme="dark" >
                                <div class="card-header">
                                    <span onclick="userClicked(${post.author.id})" style="cursor:pointer">
                                        <img class="rounded-circle border border-2" src="${post.author.profile_image}" style="width: 40px;height: 40px;" >
                                        <b>${post.author.username}</b>
                                    </span>
                                    ${editBtnContent}
                                    
                                </div>
                                <div class="card-body" onclick="postClick(${post.id})" style="cursor:pointer;">
                                    <img class="w-100" src="${post.image}">
                                    <h6 class="mt-1" style="color:grey">${post.created_at}</h6>
                                    <h5>${postTitle}</h5>
                                    <p>${post.body}</p>
                                    <hr>
                                    <div>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chat-left-text" viewBox="0 0 16 16">
                                            <path d="M14 1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H4.414A2 2 0 0 0 3 11.586l-2 2V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12.793a.5.5 0 0 0 .854.353l2.853-2.853A1 1 0 0 1 4.414 12H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"/>
                                            <path d="M3 3.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5M3 6a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9A.5.5 0 0 1 3 6m0 2.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5"/>
                                        </svg>
                                        <span class="mx-2">|  (${post.comments_count}) Comments
                                            <span id="post-tags-${post.id}">
                                                <button class="btn btn-sm rounded-5 btn-secondary">Policy</button>
                                            </span>
                                        </span>

                                    </div>
                                </div>
                            </div>
                `
                document.getElementById("posts").innerHTML+=content
                //tags
                const tagId=`post-tags-${post.id}`
                document.getElementById(tagId).innerHTML=""
                for(tag of post.tags){
                    let tagContent=`
                        <button class="btn btn-sm rounded-5 btn-secondary">${tag.name}</button>
                    `
                    document.getElementById(tagId).innerHTML+=tagContent
                }
                }
    
    })
}

function createNewPost(){
    let postId=document.getElementById("post-id-input").value
    let isCreate = postId == null || postId==""

    const postTitle=document.getElementById("post-title-input").value
    const postBody=document.getElementById("post-body-input").value
    const postImage=document.getElementById("post-image-input").files[0]
    const token=localStorage.getItem("token")

    let formData=new FormData()
    formData.append("body",postBody)
    formData.append("title",postTitle)
    formData.append("image",postImage)

    let url=``   
    let message="" 
    if(isCreate)
    {
        url="https://tarmeezacademy.com/api/v1/posts"
        message="Post Created Successfully!"
    }else
    {
        url=`https://tarmeezacademy.com/api/v1/posts/${postId}`
        formData.append("_method","put")
        message="Post Edited Successfully!"
    }
    axios.post(url,formData,
        {
             headers:{
                "Content-Type":"multipart/form-data",
                "authorization":`Bearer ${token}`
            }
        })
    .then((response)=>{
        const modal=document.getElementById("post-modal")
        const modalInstance=bootstrap.Modal.getInstance(modal )
        modalInstance.hide()
        showAlert(message,"success")
        getPosts()
    })
    .catch(error=>{
        const errorMessage=error.response.data.message
        showAlert(errorMessage,"danger")
    })



    
       
}

function postClick(postId){
    window.location=`post-details.html?postId=${postId}`
    
}

function addButton(){
    document.getElementById("post-id-input").value=""
    document.getElementById("post-modal-title").innerHTML="Create a New Post"
    document.getElementById("post-title-input").value=""
    document.getElementById("post-body-input").value=""
    document.getElementById("submit-btn").innerHTML="Post"
    let postModal=new bootstrap.Modal(document.getElementById("post-modal"),{})
    postModal.toggle()
}

function userClicked(userId){
    window.location=`profile.html?userid=${userId}`
}

