import '../css/app.css'
import 'flowbite'

function dropDownMenu(id, newStatus) {
  console.log('banana')
  const elemento = document.getElementById(id.toString())
  if (newStatus.toString() !== 'hidden') elemento.classNameList.remove('hidden')
}
