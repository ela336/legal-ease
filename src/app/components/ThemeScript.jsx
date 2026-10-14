export default function ThemeScript() {
  const code = `try{if(localStorage.getItem("theme")==="dark"){document.documentElement.classList.add("dark")}}catch(e){}`;
  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}