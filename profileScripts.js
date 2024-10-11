setupUI()
getUser()
getProfilePosts()


function getUser(){
    const urlParams=new URLSearchParams(window.location.search)
    const id=urlParams.get("userid")
        axios.get(`https://tarmeezacademy.com/api/v1/users/${id}`)
        .then((response)=>{
          const user=response.data.data
          document.getElementById("post-title-name").innerHTML=`${user.name}'s Posts`
          document.getElementById("header-image").src=user.profile_image
          document.getElementById("user-email").innerHTML=user.email
          document.getElementById("user-name").innerHTML=user.name
          document.getElementById("user-username").innerHTML=user.username
          document.getElementById("user-posts").innerHTML=user.posts_count
          document.getElementById("user-comments").innerHTML=user.comments_count
        })
    }
function getProfilePosts(){
        const urlParams=new URLSearchParams(window.location.search)
        const id=urlParams.get("userid")

        axios.get(`https://tarmeezacademy.com/api/v1/users/${id}/posts`)
        .then(function (response){
            const posts=response.data.data 
            document.getElementById("get-user-posts").innerHTML=""
            for(post of posts){
                    let postTitle=""

                    //edit button
                    let user=getCurrentUser()
                    let isMyPost=user!=null && post.author.id==user.id
                    let editBtnContent=``
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
                                        <img class="rounded-circle border border-2" src="${post.author.profile_image}" style="width: 40px;height: 40px;" >
                                        <b>${post.author.username}</b>
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
                    document.getElementById("get-user-posts").innerHTML+=content
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