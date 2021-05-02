let nickname = "";
let nicknameInput = document.getElementById("nickname");

const setNickname = function() {
    localStorage.clear();
    nickname = nicknameInput.value;
    localStorage.setItem("nickname", nickname);
}

if(nicknameInput) {
    nicknameInput.addEventListener("keyup", function(event){
        event.preventDefault();
        if(event.key === "Enter") { //event.key is deprecated
            document.getElementById("go-span").click();
        }        
    });
}