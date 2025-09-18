// src/components/Destinations.jsx
import { montSaintMichel, paris, rome, kyoto, provence, canadianRockies } from "../images";

export default function Destinations() {
  const cards = [
    { src: montSaintMichel,  title: "Mont-Saint-Michel", blurb: "Tides, abbey, and golden hour." },
    { src: paris,            title: "Paris",              blurb: "Left Bank, Louvre, dining." },
    { src: rome,             title: "Rome",               blurb: "Ancient forums & Trastevere." },
    { src: kyoto,            title: "Kyoto",              blurb: "Torii paths & tea culture." },
    { src: provence,         title: "Provence",           blurb: "Lavender & hill towns." },
    { src: canadianRockies,  title: "Canadian Rockies",   blurb: "Turquoise lakes & alpine vistas." },
  ];

  return (
    <section style={{marginTop: 48}}>
      <h2 style={{fontSize: 28, margin: "0 0 12px"}}>Signature Destinations</h2>
      <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(220px, 1fr))", gap: 16}}>
        {cards.map(c => (
          <figure key={c.title} style={{border:"1px solid #eee", borderRadius:12, overflow:"hidden", margin:0}}>
            <div style={{aspectRatio:"4/3", background:"#f4efe6", backgroundImage:`url(${c.src})`, backgroundSize:"cover", backgroundPosition:"center"}}/>
            <figcaption style={{padding:12}}>
              <div style={{fontWeight:600}}>{c.title}</div>
              <div style={{color:"#666", fontSize:14}}>{c.blurb}</div>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
