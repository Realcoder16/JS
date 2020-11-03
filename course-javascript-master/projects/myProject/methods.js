

    function showLogin() {
    document.querySelector('#login').classList.remove('hidden');
  }

   function hideLogin() {
    document.querySelector('#login').classList.add('hidden');
  }


   function showMain() {
   document.querySelector('#main').classList.remove('hidden');
  }

  function hideMain() {
  document.querySelector('#main').classList.add('hidden');
  }


  function set(UserName ) {
  document.querySelector('[data-role=user-name]').textContent = UserName ;
  }

   function get(UserName) {
    return UserName;
  }

  function onMessage({ type, from, data }) {
    console.log(type, from, data);

    if (type === 'hello') {
      this.ui.userList.add(from);
      this.ui.messageList.addSystemMessage(`${from} вошел в чат`);
    } else if (type === 'user-list') {
      for (const item of data) {
        this.ui.userList.add(item);
      }
    } else if (type === 'bye-bye') {
      this.ui.userList.remove(from);
      this.ui.messageList.addSystemMessage(`${from} вышел из чата`);
    } else if (type === 'text-message') {
      this.ui.messageList.add(from, data.message);
    }
  }

  export    {
    showLogin,
    hideLogin,
    showMain,
    hideMain,
    set,
    get,
    onMessage

}