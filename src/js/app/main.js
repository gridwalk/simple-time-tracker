
window['new-project-name'].addEventListener("keyup", function(event) {
    event.preventDefault();
    if (event.keyCode === 13) {
      createProject()
    }
})

window.addEventListener('keydown',function(e){

  var focusId = document.activeElement.getAttribute('project-id')
  var inputIsFocused = (document.activeElement.tagName == 'INPUT')

  // delete
  if(e.which == 46){    
    if(inputIsFocused) return
    confirmDeleteSelected(focusId)
    return
  }

  // enter (click)
  if(e.which == 13){
    document.activeElement.click()
    return
  }

  // r (reset)
  if(e.which == 82){
    if(inputIsFocused) return
    if(!focusId) return

    var shouldReset = confirm("Reset selected project?")
    if( shouldReset ){
      state.projects[focusId].running = false
      state.projects[focusId].seconds = 0
      state.projects[focusId].runningSeconds = 0
      renderState()  
    }

    return    
  }

  // n (rename)
  if(e.which == 78){
    if(inputIsFocused) return
    var newName = null
    while( newName == null ){
      newName = prompt("Rename project to:",state.projects[focusId].name)
    }    
    state.projects[focusId].name = newName
    renderState()
    return
  }

  // d (delete)
  if(e.which == 68){
    if(inputIsFocused) return
    confirmDeleteSelected(focusId)
    return
  }

  // + (add 5 mins)
  if(e.which == 187){
    if(inputIsFocused) return
    addTimeToProject(focusId,300)
    return
  }

  // - (minus 5 mins)
  if(e.which == 189){
    if(inputIsFocused) return
    addTimeToProject(focusId,-300)
    return
  }

  var _tabbable = document.querySelectorAll('[tabindex]')

  // down
  if(e.which == 40){
    for (var i = 0; i < _tabbable.length; i++) {
      if( _tabbable[i] == document.activeElement ){
        _tabbable[i+1].focus()
        break
      }
    }
    if( focusId == null && !inputIsFocused ) window['new-project-name'].focus()
    renderState()
    e.preventDefault()
    return
  }

  // up
  if(e.which == 38){
    for (var j = 0; j < _tabbable.length; j++) {
      if( _tabbable[j] == document.activeElement ){
        _tabbable[j-1].focus()
        break
      }
    }
    if( focusId == null && !inputIsFocused ) window['new-project-name'].focus()
    renderState()
    e.preventDefault()
    return
  }
  
})

function confirmDeleteSelected(focusId){
  var shouldDelete = confirm("Delete selected project?")
  if( shouldDelete ){
    state.projects.splice(focusId,1)
    renderState()  
  }
}

function addTimeToProject(focusId,seconds){
  state.projects[focusId].seconds+=seconds
  if(state.projects[focusId].seconds < 0)
    state.projects[focusId].seconds = 0
  renderState()
}


function createProject() {

  var projectName = window['new-project-name'].value
  window['new-project-name'].value = ''

  var newProject = {
    'name':           projectName,
    'seconds':        0,
    'runningSeconds': 0,
    'running':        false,
    'projectId':      state.projects.length,
    'sessionStart':   null
  }
  
  state.projects.push(newProject)

  renderState()
  
}


function renderProjects() {

  // save focused element id
  var focusId = document.activeElement.getAttribute('project-id')

  window['projects'].innerHTML = ''

  for (var i = 0; i < state.projects.length; i++) {

      var project = state.projects[i]  

      var _project = createEl('div', project.name, {
        'class':      'project',
        'project-id': i,
        'tabindex':   0,
        'running':    project.running
      })

      var seconds = project.seconds + project.runningSeconds



      var _time = createEl('span', toHHMMSS(seconds) )
      _project.appendChild(_time)

      window['projects'].appendChild(_project)

      // add focus
      if( focusId == i ) _project.focus()

      _project.onclick = function(){
        var projectId = this.getAttribute('project-id')

        var project = state.projects[projectId]

        project.running = !project.running

        // set start time
        if( project.running ){
          project.sessionStart = now()
        }

        // add running seconds to timer
        if( !project.running ){
          project.seconds = project.seconds + project.runningSeconds
          project.runningSeconds = 0
        }

        renderState()
      }
    
  }

}

var title = {
  counter: 36,
  tag: document.getElementsByTagName('title')[0],
  render:function(){

    var running = false
    for (var i = state.projects.length - 1; i >= 0; i--) {
      if( state.projects[i].running ) running = true
    }

    if( running ){
      title.counter++
      if( title.counter > 46 ) title.counter = 36
      title.tag.innerHTML = '&#1283'+title.counter+'; FF Time'
    }else{
      title.tag.innerHTML = '&#128511; FF Time'
    }
  }
}


function tick(argument) {

  var anyProjectRunning = false

  // increment seconds on each project
  for (var i = 0; i < state.projects.length; i++) {

    var project = state.projects[i]

    if( !project.running ) continue
    
    anyProjectRunning = true
    project.runningSeconds = now() - project.sessionStart

  }

  if( anyProjectRunning ) renderState()

  setTimeout(tick,1000)
}

// default state
var state = {
  projects: []
}

function saveState(){
  // console.log('saving')
  localStorage.state = JSON.stringify(state)
}

function loadState() {
  if( !localStorage.state ) return
  state = JSON.parse(localStorage.state)
  renderState()
}

function renderState(noSave) {
  renderProjects()
  title.render()
  if( noSave ) return
  saveState()
}

loadState()


tick()