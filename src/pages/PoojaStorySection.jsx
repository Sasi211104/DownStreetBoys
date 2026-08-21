import React, { useState } from "react";
import "./PoojaStorySection.css";

function PoojaStorySection() {
  const [activeTab, setActiveTab] = useState("chants");

  return (
    <div className="festival-section pooja-story-wrapper">
      <div className="section-heading">
        <span>✦ SACRED DEVOTION &amp; WISDOM ✦</span>
        <h2>
          గణపతి <strong>మంత్రాలు, పూజా విధానం &amp; కథ</strong>
        </h2>
        <p>
          వినాయకుని శక్తివంతమైన మూల మంత్రాలు, నిత్య పారాయణ శ్లోకాలు, షోడశోపచార పూజా విధానం మరియు సంపూర్ణ శమంతకమణి వ్రత కథ.
        </p>
      </div>

      {/* 4 Navigation Tabs */}
      <div className="pooja-tabs-row">
        <button
          className={`pooja-tab-btn ${activeTab === "chants" ? "active" : ""}`}
          onClick={() => setActiveTab("chants")}
        >
          🕉️ గణపతి మంత్రాలు (Chants)
        </button>
        <button
          className={`pooja-tab-btn ${activeTab === "shlokas" ? "active" : ""}`}
          onClick={() => setActiveTab("shlokas")}
        >
          📿 నిత్య శ్లోకాలు (Shlokas)
        </button>
        <button
          className={`pooja-tab-btn ${activeTab === "vidhanam" ? "active" : ""}`}
          onClick={() => setActiveTab("vidhanam")}
        >
          🪔 పూజా విధానం (Puja Vidhi)
        </button>
        <button
          className={`pooja-tab-btn ${activeTab === "katha" ? "active" : ""}`}
          onClick={() => setActiveTab("katha")}
        >
          📜 వ్రత కథ (Vratha Katha)
        </button>
      </div>

      {/* TAB 1: SACRED MANTRAS & CHANTS (గణపతి మంత్రాలు) */}
      {activeTab === "chants" && (
        <div className="pooja-content-box fade-in">
          {/* Moola Mantra */}
          <div className="shloka-card">
            <span className="shloka-badge">1. గణేశ మూల మంత్రం (MOOLA MANTRA)</span>
            <p className="shloka-telugu" style={{ fontSize: "1.35rem", color: "#f59e0b" }}>
              "ఓం గం గణపతయే నమః ॥"
            </p>
            <div className="shloka-meaning">
              <strong>భావం:</strong> సమస్త విఘ్నాలను తొలగించి, బుద్ధి మరియు సకల కార్యసిద్ధిని ప్రసాదించే గణనాథునికి నా భక్తిపూర్వక ప్రణామాలు.
            </div>
          </div>

          {/* Ganesha Gayatri Mantra */}
          <div className="shloka-card">
            <span className="shloka-badge">2. గణేశ గాయత్రీ మంత్రం (GANESHA GAYATRI)</span>
            <p className="shloka-telugu">
              "ఓం ఏకదంతాయ విద్మహే వక్రతుండాయ ధీమహి ।<br />
              తన్నో దంతిః ప్రచోదయాత్ ॥"
            </p>
            <div className="shloka-meaning">
              <strong>భావం:</strong> ఏకదంతుడైన గణపతిని మేము తెలుసుకుంటున్నాము. వక్రతుండుడైన ఆ స్వామిని ధ్యానిస్తున్నాము. ఆ దంతధారి మా బుద్ధిని సన్మార్గంలో నడిపించుగాక!
            </div>
          </div>

          {/* Siddhi Vinayaka Maha Mantra */}
          <div className="shloka-card">
            <span className="shloka-badge">3. సిద్ధి వినాయక మహా మంత్రం (SIDDHI VINAYAKA MANTRA)</span>
            <p className="shloka-telugu">
              "ఓం శ్రీం హ్రీం క్లీం గ్లౌం గం గణపతయే వర వరద సర్వజనం మే వశమానయ స్వాహా ॥"
            </p>
            <div className="shloka-meaning">
              <strong>భావం:</strong> సమస్త కార్యజయాలను, అష్టైశ్వర్యాలను మరియు మనఃశాంతిని ప్రసాదించే సర్వోత్కృష్టమైన సిద్ధివినాయక బీజాక్షర మంత్రం.
            </div>
          </div>

          {/* Dwadashanama Stotram (12 Names) */}
          <div className="shloka-card">
            <span className="shloka-badge">4. సంకట నాశన ద్వాదశ నామ స్తోత్రం (12 SACRED NAMES)</span>
            <p className="shloka-telugu" style={{ fontSize: "1rem", lineHeight: "1.9" }}>
              1. సుముఖశ్చ 2. ఏకదంతశ్చ 3. కపిలో 4. గజకర్ణకః ।<br />
              5. లంబోదరశ్చ 6. వికటో 7. విఘ్నరాజో 8. వినాయకః ॥<br />
              9. ధూమ్రకేతుః 10. గణాధ్యక్షో 11. భాలచంద్రో 12. గజాననః ।<br />
              ద్వాదశైతాని నామాని యః పఠేచ్ఛృణుయాదపి ॥
            </p>
            <div className="shloka-meaning">
              <strong>ఫలశ్రుతి:</strong> విద్యార్థికి విద్య, ధనార్థికి ధనం, పుత్రార్థికి సంతానం మరియు సకల విఘ్న నివారణ లభిస్తాయి.
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: NITYA SHLOKAS (నిత్య పారాయణ శ్లోకాలు) */}
      {activeTab === "shlokas" && (
        <div className="pooja-content-box fade-in">
          <div className="shloka-card">
            <span className="shloka-badge">వక్రతుండ మహాకాయ (VAKRATUNDA MAHAKAYA)</span>
            <p className="shloka-telugu">
              "వక్రతుండ మహాకాయ సూర్యకోటి సమప్రభ ।<br />
              నిర్విఘ్నం కురు మే దేవ సర్వకార్యేషు సర్వదా ॥"
            </p>
            <div className="shloka-meaning">
              <strong>భావం:</strong> వంకరైన తొండము కలవాడా, కోటి సూర్యుల తేజస్సుతో వెలుగొందే మహానుభావా! నా సకల కార్యాలనూ ఎల్లప్పుడూ నిర్విఘ్నంగా నెరవేర్చు స్వామీ.
            </div>
          </div>

          <div className="shloka-card">
            <span className="shloka-badge">శుక్లాంబరధరం (SHUKLAM BHARADHARAM)</span>
            <p className="shloka-telugu">
              "శుక్లాంబరధరం విష్ణుం శశివర్ణం చతుర్భుజం ।<br />
              ప్రసన్నవదనం ధ్యాయేత్ సర్వవిఘ్నోపశాంతయే ॥"
            </p>
            <div className="shloka-meaning">
              <strong>భావం:</strong> తెల్లని వస్త్రములు ధరించినవాడు, సర్వవ్యాపకుడు, చంద్రుని వంటి కాంతి కలవాడు, నాలుగు భుజములు గలవాడు, ప్రసన్నమైన ముఖము గలవాడైన విఘ్నేశ్వరుని సమస్త ఆటంకాలు తొలగిపోవడానికి ధ్యానిస్తున్నాను.
            </div>
          </div>

          <div className="shloka-card">
            <span className="shloka-badge">అగజానన పద్మార్కం (AGAJANANA PADMARKAM)</span>
            <p className="shloka-telugu">
              "అగజానన పద్మార్కం గజానన మహర్నిశం ।<br />
              అనేకదంతం భక్తానాం ఏకదంతముపాస్మహే ॥"
            </p>
            <div className="shloka-meaning">
              <strong>భావం:</strong> సూర్యుని కాంతి తామరను వికసింపజేసినట్లుగా, పార్వతీదేవి ముఖపద్మాన్ని ఆనందింపజేసేవాడు, భక్తులకు కొంగుబంగారమై వరాలనిచ్చే ఏకదంతునికి నమస్కరిస్తున్నాను.
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: 16-STEP PUJA VIDHANAM (షోడశోపచార పూజ) */}
      {activeTab === "vidhanam" && (
        <div className="pooja-content-box fade-in">
          <h3 className="sub-section-title">🪔 16-Step Shodashopachara Puja (షోడశోపచార పూజ)</h3>
          <p className="sub-section-desc">వినాయక చవితి నాడు స్వామికి సమర్పించవలసిన సాంప్రదాయ షోడశోపచార పూజా క్రమం:</p>

          <div className="vidhanam-steps-grid">
            <div className="step-item">
              <span className="step-num">1</span>
              <h4>ఆవాహనం</h4>
              <p>మంత్రపూర్వకంగా భక్తితో విఘ్నేశ్వరుని ప్రతిమలోకి ఆహ్వానించడం.</p>
            </div>
            <div className="step-item">
              <span className="step-num">2</span>
              <h4>ఆసనం</h4>
              <p>పుష్పాలు, అక్షతలతో స్వామివారికి దివ్యమైన ఆసనాన్ని సమర్పించడం.</p>
            </div>
            <div className="step-item">
              <span className="step-num">3</span>
              <h4>పాద్యం &amp; అర్ఘ్యం</h4>
              <p>పాదాలు మరియు హస్తాలు కడుగుటకు పవిత్ర గంగాజలాన్ని సమర్పించడం.</p>
            </div>
            <div className="step-item">
              <span className="step-num">4</span>
              <h4>ఆచమనీయం</h4>
              <p>శుద్ధ జలంతో ఆచమనం చేయించడం.</p>
            </div>
            <div className="step-item">
              <span className="step-num">5</span>
              <h4>స్నానం (అభిషేకం)</h4>
              <p>పంచామృతాలు (పాలు, పెరుగు, తేనె, నెయ్యి, చక్కెర) &amp; సుగంధ జలాలతో అభిషేకం.</p>
            </div>
            <div className="step-item">
              <span className="step-num">6</span>
              <h4>వస్త్రం &amp; యజ్ఞోపవీతం</h4>
              <p>ఎర్రని/పసుపు వస్త్రములు, జంధ్యం మరియు గంధం అలంకరించడం.</p>
            </div>
            <div className="step-item">
              <span className="step-num">7</span>
              <h4>21 పత్రి పూజ</h4>
              <p>గరిక, మారేడు, మాచిపత్రి, తులసి సహా 21 రకాల పవిత్ర పత్రాలతో అర్చన.</p>
            </div>
            <div className="step-item">
              <span className="step-num">8</span>
              <h4>ధూపం &amp; దీపం</h4>
              <p>సుగంధ ధూపమును మరియు ఆవునేతితో వెలిగించిన దీపాన్ని సమర్పించడం.</p>
            </div>
            <div className="step-item">
              <span className="step-num">9</span>
              <h4>నైవేద్యం</h4>
              <p>కుడుములు, ఉండ్రాళ్ళు, మోదకాలు, లడ్డూలు మరియు కొబ్బరికాయ సమర్పించడం.</p>
            </div>
            <div className="step-item">
              <span className="step-num">10</span>
              <h4>మంగళ హారతి &amp; ప్రదక్షిణ</h4>
              <p>కర్పూర నీరాజనం ఇచ్చి కుటుంబంతో మూడు ఆత్మప్రదక్షిణలు చేయడం.</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: COMPLETE VRATHA KATHA (సంపూర్ణ వ్రత కథ) */}
      {activeTab === "katha" && (
        <div className="pooja-content-box fade-in story-box">
          <h3 className="story-main-heading">📜 శ్రీ వినాయక చవితి సంపూర్ణ వ్రత కథ</h3>

          <div className="story-segment">
            <h4>1. గణపతి జననం (The Divine Birth)</h4>
            <p>
              ఒకనాడు పార్వతీదేవి నలుగు పిండితో ఒక బాలుడి రూపాన్ని సృష్టించి, ప్రాణప్రతిష్ఠ చేసి ద్వారపాలకుడిగా ఉంచింది. పరమేశ్వరుడు లోపలికి ప్రవేశించబోగా ఆ బాలుడు అడ్డగించాడు. ఆగ్రహించిన శంకరుడు త్రిశూలంతో బాలుని శిరస్సును ఖండించాడు. పార్వతీదేవి విలపించగా, శివుడు ఉత్తర దిక్కున తలపెట్టి నిద్రిస్తున్న గజము (ఏనుగు) శిరస్సును తెప్పించి ఆ బాలుడి మొండానికి జోడించి ప్రాణం పోసి ‘గజాననుడు’ అని నామకరణం చేశాడు.
            </p>
          </div>

          <div className="story-segment">
            <h4>2. గణాధిపత్యం &amp; విఘ్నేశ్వరుని వరం</h4>
            <p>
              దేవతలందరూ విఘ్నాలను తొలగించే అధిపతిని నియమించమని కోరగా, శివుడు కుమారస్వామి, గజాననులకు ముల్లోకాలను ముందుగా ఎవరు చుట్టి వస్తారో వారికే గణాధిపత్యం అని పరీక్ష పెట్టాడు. కుమారస్వామి తన నెమలి వాహనంపై బయలుదేరగా, వినాయకుడు తల్లిదండ్రులైన పార్వతీపరమేశ్వరుల చుట్టూ భక్తితో మూడు ప్రదక్షిణలు చేశాడు. తల్లిదండ్రులకు చేసిన ప్రదక్షిణ సర్వసృష్టికి చేసినట్లేనని శాస్త్రం చెప్పడంతో గణపతి గణాధిపతిగా ‘విఘ్నేశ్వరుడు’ అయ్యాడు.
            </p>
          </div>

          <div className="story-segment">
            <h4>3. చంద్రుని శాపం &amp; శమంతకమణి ఉపాఖ్యానం</h4>
            <p>
              భాద్రపద శుద్ధ చవితి నాడు వినాయకుడు భక్తుల సమర్పించిన కుడుములు, ఉండ్రాళ్ళు ఆరగించి మూషిక వాహనంపై వెళ్తుండగా చంద్రుడు పరిహసించి నవ్వాడు. దాంతో కోపించిన గణపతి ‘భాద్రపద చవితి నాడు నిన్ను చూసిన వారికి నీలాపనిందలు కలుగుతాయి’ అని శపించాడు.
            </p>
            <p>
              ద్వాపర యుగంలో శ్రీకృష్ణుడు కూడా ఆనాడు పాలలో చంద్రుడి ప్రతిబింబాన్ని చూసి శమంతకమణిని దొంగిలించాడనే నిందను ఎదుర్కొన్నాడు. తర్వాత జాంబవంతునితో 28 రోజులు యుద్ధం చేసి మణిని, జాంబవతిని తీసుకొచ్చి నిందను పోగొట్టుకున్నాడు. అప్పటినుండి వినాయక చవితి పూజ చేసి అక్షతలు తలపై వేసుకున్నవారికి ఎలాంటి అపనిందలు రావని భగవానుడు అనుగ్రహించాడు.
            </p>
          </div>

          <div className="story-akshata-mantra">
            <span className="akshata-title">✦ అక్షతల మంత్రం (ఈ మంత్రం చదువుతూ తలపై అక్షతలు వేసుకోవాలి) ✦</span>
            <p>
              "సింహః ప్రసేనమవధీత్ సింహో జాంబవతా హతః ।<br />
              సుకుమారక మా రోదీః తవ హ్యేష శ్యమంతకః ॥"
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default PoojaStorySection;