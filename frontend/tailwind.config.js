/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,vue}",
  ],
  theme: {
    extend: {
      fontFamily: {
        playwrite: ['"Playwrite AU SA"', 'sans-serif'],
        imperial: ['"Imperial Script"', ],// Add your font here
      },
      backgroundImage:{
        "mapTexture":"url('/src/assets/map.jpg')",
        "stripes": "repeating-linear-gradient(45deg, black,black 2px,transparent 3px,transparent 15px)"
      },
      keyframes:{
        bigToSmol:{
          "0%":{bottom:"50%",right:"50%", fontSize:"120px", transform:"translate(50%, 50%)"},
          "100%":{bottom:"0",right:"10px",fontSize :"20px",transform:"translate(0,0)"},
        },
        benWegMan:{
          "0%":{transform: "1"},
          "100%":{size:"0"},

        }

      },
      animation:{
        bigToSmol:"bigToSmol 3s ease-in ",
        benWegMan:"benWegMan 3s forwards ",
      }
    },
  },
  plugins: [],

}

