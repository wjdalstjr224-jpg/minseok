const mealData = [
  "쌀밥",
  "제육볶음",
  "된장국",
  "계란말이",
  "배추김치",
  "요구르트"
];

document.getElementById("todayDate").textContent =
new Date().toLocaleDateString("ko-KR");

const mealList = document.getElementById("mealList");

mealData.forEach(menu=>{
  const li=document.createElement("li");
  li.textContent=menu;
  mealList.appendChild(li);
});

let selectedRating = 0;

const stars = document.querySelectorAll(".star");

stars.forEach(star=>{
  star.addEventListener("click",()=>{

    selectedRating = Number(star.dataset.value);

    stars.forEach(s=>s.classList.remove("active"));

    for(let i=0;i<selectedRating;i++){
      stars[i].classList.add("active");
    }
  });
});

document.getElementById("rateBtn")
.addEventListener("click",()=>{

  if(selectedRating===0){
    alert("별점을 선택하세요.");
    return;
  }

  const ratings =
  JSON.parse(localStorage.getItem("ratings")) || [];

  ratings.push(selectedRating);

  localStorage.setItem(
    "ratings",
    JSON.stringify(ratings)
  );

  loadStats();
  loadRanking();

  alert("평가가 등록되었습니다.");
});

document.getElementById("commentBtn")
.addEventListener("click",()=>{

  const text =
  document.getElementById("commentInput")
  .value.trim();

  if(!text) return;

  const comments =
  JSON.parse(localStorage.getItem("comments")) || [];

  comments.push(text);

  localStorage.setItem(
    "comments",
    JSON.stringify(comments)
  );

  document.getElementById("commentInput").value="";

  loadComments();
  loadStats();
});

function loadComments(){

  const comments =
  JSON.parse(localStorage.getItem("comments")) || [];

  const list =
  document.getElementById("commentList");

  list.innerHTML="";

  comments.slice().reverse().forEach((comment,index)=>{

    const div=document.createElement("div");
    div.className="comment";

    div.innerHTML=`
      ${comment}
      <button class="delete-btn"
      onclick="deleteComment(${comments.length-1-index})">
      삭제
      </button>
    `;

    list.appendChild(div);
  });
}

function deleteComment(index){

  const comments =
  JSON.parse(localStorage.getItem("comments")) || [];

  comments.splice(index,1);

  localStorage.setItem(
    "comments",
    JSON.stringify(comments)
  );

  loadComments();
  loadStats();
}

document.getElementById("photoInput")
.addEventListener("change",(e)=>{

  const file=e.target.files[0];

  if(!file) return;

  const reader=new FileReader();

  reader.onload=function(){

    const photos=
    JSON.parse(localStorage.getItem("photos")) || [];

    photos.push(reader.result);

    localStorage.setItem(
      "photos",
      JSON.stringify(photos)
    );

    loadPhotos();
    loadStats();
  };

  reader.readAsDataURL(file);
});

function loadPhotos(){

  const photos=
  JSON.parse(localStorage.getItem("photos")) || [];

  const gallery=
  document.getElementById("gallery");

  gallery.innerHTML="";

  photos.forEach(photo=>{

    const img=document.createElement("img");
    img.src=photo;

    gallery.appendChild(img);
  });
}

function loadStats(){

  const ratings=
  JSON.parse(localStorage.getItem("ratings")) || [];

  const comments=
  JSON.parse(localStorage.getItem("comments")) || [];

  const photos=
  JSON.parse(localStorage.getItem("photos")) || [];

  let avg=0;

  if(ratings.length){
    avg=
    ratings.reduce((a,b)=>a+b,0) /
    ratings.length;
  }

  document.getElementById("avgRating")
  .textContent=avg.toFixed(1);

  document.getElementById("commentCount")
  .textContent=comments.length;

  document.getElementById("photoCount")
  .textContent=photos.length;
}

function loadRanking(){

  const ratings=
  JSON.parse(localStorage.getItem("ratings")) || [];

  let avg=4.5;

  if(ratings.length){
    avg=
    ratings.reduce((a,b)=>a+b,0) /
    ratings.length;
  }

  const ranking=[
    {menu:"제육볶음",score:avg.toFixed(1)},
    {menu:"치킨마요덮밥",score:"4.8"},
    {menu:"돈까스",score:"4.7"},
    {menu:"카레라이스",score:"4.5"},
    {menu:"비빔밥",score:"4.4"}
  ];

  ranking.sort((a,b)=>b.score-a.score);

  const tbody=
  document.getElementById("rankingBody");

  tbody.innerHTML="";

  ranking.forEach((item,index)=>{

    tbody.innerHTML += `
      <tr>
        <td>${index+1}</td>
        <td>${item.menu}</td>
        <td>${item.score}</td>
      </tr>
    `;
  });
}

loadComments();
loadPhotos();
loadStats();
loadRanking();
