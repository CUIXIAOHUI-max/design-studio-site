import { useEffect, useState, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import heroImg from "./assets/hero.jpg";
import "./App.css";

gsap.registerPlugin(ScrollTrigger);

/* ===== 落地案例數據 — 只保留本地有圖的項目 ===== */
const projectCases = [
  {
    id: "si-er-ra-sea",
    name: "Sierra Sea 西沙灣",
    location: "西沙",
    style: "現代簡約",
    area: "—",
    cover: "/images/projects/si-er-ra-sea/3401f795ei0ff635666d0305050e7969.jpg",
    images: [
      "/images/projects/si-er-ra-sea/3401f795ei0ff635666d0305050e7969.jpg",
      "/images/projects/si-er-ra-sea/3a5ffac1cs723a4385ad8a0a5e4d5e7a.jpg",
      "/images/projects/si-er-ra-sea/41b1ba1bdr98b16a10deb4ab11438acc.jpg",
      "/images/projects/si-er-ra-sea/58df040a4i1cd558b8aa4b7d8dacca65.jpg",
      "/images/projects/si-er-ra-sea/9dce58d7fid700bf33838cb8dc3ffba1.jpg",
      "/images/projects/si-er-ra-sea/cbcad6874m1b5e5d53230ccf338cb39f.jpg",
      "/images/projects/si-er-ra-sea/e0791ac8ai42ce89fdea2763f6b8f994.jpg",
      "/images/projects/si-er-ra-sea/f0fe8002dudd7c79f2818b47d7403e3f.jpg",
    ],
    featured: true,
  },
  {
    id: "hui-du",
    name: "匯都",
    location: "洪水橋",
    style: "現代輕奢",
    area: "—",
    cover: "/images/projects/hui-du/05b39e25bp595525e6ad8333031f07ec.jpg",
    images: [
      "/images/projects/hui-du/05b39e25bp595525e6ad8333031f07ec.jpg",
      "/images/projects/hui-du/08deb47f3tc89604935bf96c02d369da.jpg",
      "/images/projects/hui-du/0b9b51bffh98462ddb3620a30cb6c39c.jpg",
      "/images/projects/hui-du/0d8588ed9qf66bb46f26e17f6d3dc32e.jpg",
      "/images/projects/hui-du/0ddf30307o3be520da1fec68c54b439b.jpg",
      "/images/projects/hui-du/0de148435o5b86a282d943c7e8464304.jpg",
      "/images/projects/hui-du/1bf4cafb2s43798f99d36df2243fbf12.jpg",
      "/images/projects/hui-du/1c7e68e2enb305f6778ebe4124a9e2a7.jpg",
      "/images/projects/hui-du/27fb4dcb4jbf387f2c19c389a47fa90e.jpg",
      "/images/projects/hui-du/29ae0fda5k05f1aa8f5e2846a37d4843.jpg",
      "/images/projects/hui-du/37c07b6d7h9b5900b19ae7c8b8ce3efb.jpg",
      "/images/projects/hui-du/46e54fefdpbf637cb8fd226983d34954.jpg",
      "/images/projects/hui-du/4d6253932x9edaa9af692a703ae02376.jpg",
      "/images/projects/hui-du/5f91e153dsf8a22bc25372f8494c0f7f.jpg",
      "/images/projects/hui-du/66cf07e74e663f5c9e01a3bdb9e70ff2.jpg",
      "/images/projects/hui-du/6689c435er3488b0b422b61652ca587b.jpg",
    ],
  },
  {
    id: "gold-coast",
    name: "黃金海灣",
    location: "屯門",
    style: "現代風格",
    area: "—",
    cover: "/images/projects/gold-coast/1cff36086m2e12b3d6fb3d8ed45d4085.jpg",
    images: [
      "/images/projects/gold-coast/1cff36086m2e12b3d6fb3d8ed45d4085.jpg",
      "/images/projects/gold-coast/28231d98aq1216b4a9e65ab67983bac5.jpg",
      "/images/projects/gold-coast/3605ccdb9u4434f233b7aada64778f3a.jpg",
      "/images/projects/gold-coast/6c11f82a5lb6531f9cd6b4a0e150cc6c.jpg",
      "/images/projects/gold-coast/7ee108619p1736fef32927e3ec924f68.jpg",
      "/images/projects/gold-coast/ab0d40db5u96294e9256e155f8ef297b.jpg",
      "/images/projects/gold-coast/bf94d809doe09bc6f3a1654defb4ec1d.jpg",
      "/images/projects/gold-coast/d53e562ddgb923c73347912c323ba5ad.jpg",
    ],
  },
  {
    id: "dong-chong",
    name: "東涌啟東閣",
    location: "東涌",
    style: "現代簡約",
    area: "—",
    cover: "/images/projects/dong-chong/1d8d01a5bs8c2fdc469f166e26671379.jpg",
    images: [
      "/images/projects/dong-chong/1d8d01a5bs8c2fdc469f166e26671379.jpg",
      "/images/projects/dong-chong/2329f5d42jcbbf1ee58ea4aa1f7470f5.jpg",
      "/images/projects/dong-chong/2a254de3bv81a9b41a4d4065dc15d0fe.jpg",
      "/images/projects/dong-chong/34f9ff5ddt36e6439074564ac18e796c.jpg",
      "/images/projects/dong-chong/3d9abb6ddk35449b064f7f1fd59b7cb0.jpg",
    ],
  },
  {
    id: "xiang-dong",
    name: "翔東村",
    location: "翔東邨",
    style: "實用裝修",
    area: "—",
    cover: "/images/projects/xiang-dong/04f0f3d57k341dca61bae526024da282.jpg",
    images: [
      "/images/projects/xiang-dong/04f0f3d57k341dca61bae526024da282.jpg",
      "/images/projects/xiang-dong/122d185b7u0f83fe81d03575e3381ef5.jpg",
      "/images/projects/xiang-dong/305d7ef9fm9838c2b3c72ba8e501a690.jpg",
      "/images/projects/xiang-dong/3c569f63foa90111daa968f74014349b.jpg",
      "/images/projects/xiang-dong/3cf453150hb48e8f5b6388f3e1d45f33.jpg",
    ],
  },
];

/* 工廠及展廳 */
const showcaseItems = [
  {
    id: "factory",
    name: "自設廠房",
    subtitle: "50,000 呎內地現代化廠房",
    desc: "自家生產線確保品質及工期，不受第三方約束。從板材切割到成品組裝，每個環節由我們親手掌控。",
    cover: "/images/projects/factory/3002d49f8v67b5fd882197e2ea00f67e.jpg",
    images: [
      "/images/projects/factory/3002d49f8v67b5fd882197e2ea00f67e.jpg",
      "/images/projects/factory/38deb0f8cv997dfe24978299f4d32b43.jpg",
      "/images/projects/factory/aa730c324p8e7d03d4b233699e98910c.jpg",
      "/images/projects/factory/b306edd04g745512ee0beca4f0ee38be.jpg",
      "/images/projects/factory/b592c7d04j396b8ccb5afe4533ea2a98.jpg",
    ],
  },
  {
    id: "stainless",
    name: "不鏽鋼櫥櫃展廳",
    subtitle: "高端廚櫃訂製 · 防水防霉",
    desc: "專注不鏽鋼櫥櫃設計與生產，適合香港潮濕氣候。款式涵蓋現代簡約到輕奢風格。",
    cover: "/images/projects/stainless/07b170e72od7f6ff66856c24f9d42015.jpg",
    images: [
      "/images/projects/stainless/07b170e72od7f6ff66856c24f9d42015.jpg",
      "/images/projects/stainless/12fe5839bp142fa5dffe4658aa7d7882.jpg",
      "/images/projects/stainless/171f7210co16808538c7002ee95f3acd.jpg",
      "/images/projects/stainless/1bb71d3fcpbcfcca5c4cac5f7706770f.jpg",
      "/images/projects/stainless/279a467a8va176878f9bd15855bcf84a.jpg",
    ],
  },
];

/* ===== SECTION COMPONENTS ===== */

function Header() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <header className={`header ${scrolled ? "header--scrolled" : ""}`}>
      <div className="header__brand">
        <img src="/images/logo/logo2.png" alt="廣翊" className="header__logo-img"
          onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block'; }} />
        <span className="header__logo-text" style={{ display: 'none' }}>KWONG YIK</span>
      </div>
      <nav>
        <ul className="header__nav">
          <li><a href="#about">關於</a></li>
          <li><a href="#services">服務</a></li>
          <li><a href="#portfolio">案例</a></li>
          <li><a href="#showcase">廠房展廳</a></li>
          <li><a href="#partners">合作夥伴</a></li>
          <li><a href="#contact">聯絡</a></li>
        </ul>
      </nav>
    </header>
  );
}

function Hero() {
  const ref = useRef(null);
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".hero__tag", { opacity: 0, y: 20, duration: 1, delay: 0.3, ease: "power3.out" });
      gsap.from(".hero__headline", { opacity: 0, y: 30, duration: 1.2, delay: 0.6, ease: "power3.out" });
      gsap.from(".hero__subline", { opacity: 0, y: 20, duration: 1, delay: 0.9, ease: "power3.out" });
      gsap.from(".hero__cta", { opacity: 0, y: 20, duration: 0.8, delay: 1.2, ease: "power3.out" });
      gsap.from(".hero__trust", { opacity: 0, duration: 1, delay: 1.5 });
      // Ken Burns — 緩慢放大
      gsap.to(".hero__bg img", {
        scale: 1.15,
        ease: "none",
        scrollTrigger: {
          trigger: ref.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    }, ref);
    return () => ctx.revert();
  }, []);
  return (
    <section className="hero" ref={ref}>
      <div className="hero__bg">
        <img src={heroImg} alt="" />
      </div>
      <div className="hero__overlay" />
      <div className="hero__content">
        <span className="hero__tag">KWONG YIK · 香港</span>
        <h1 className="hero__headline">
          以<em>匠心</em>，築生活
        </h1>
        <p className="hero__subline">
          廣翊全屋傢私訂造及裝修工程服務有限公司，紮根香港三十一年。
          自設五萬呎內地廠房，從設計、生產到施工一體化服務，
          用心打造每一個有溫度的家。
        </p>
        <a href="#portfolio" className="hero__cta">
          瀏覽案例
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 3v10m0 0l4-4m-4 4l-4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </a>
        <div className="hero__trust">
          <span className="hero__trust-item">上門度尺</span>
          <span className="hero__trust-item">自家工廠</span>
          <span className="hero__trust-item">全屋定制</span>
          <span className="hero__trust-item">一條龍服務</span>
        </div>
      </div>
      <div className="hero__scroll">
        <span>SCROLL</span>
        <div className="hero__scroll-line" />
      </div>
    </section>
  );
}

function About() {
  const ref = useRef(null);
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray(".about .reveal").forEach((el) => {
        gsap.to(el, {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 85%" },
        });
      });
    }, ref);
    return () => ctx.revert();
  }, []);
  return (
    <section id="about" className="about" ref={ref}>
      <div className="container">
        <div className="about__grid">
          <div className="about__text">
            <span className="section-label reveal">ABOUT</span>
            <h2 className="section-heading reveal">三十一年，只做一件事</h2>
            <p className="reveal">
              廣翊自1995年成立，專注全屋傢私訂造與裝修工程，香港設有門市，內地自設五萬呎現代化廠房，
              從設計、生產到安裝一條龍服務，確保每個環節品質可控。
            </p>
            <p className="reveal">
              我們不只是一間裝修公司 —— 我們擁有自己的不鏽鋼櫥櫃生產線、
              高端柚木定製工藝、以及經驗豐富的設計與施工團隊。
              不做中介，不外包，每一個細節都由我們親手完成。
            </p>
            <div className="about__feature reveal">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.5"/><path d="M6 10l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              <span>香港門市 + 深圳分公司 + 內地廠房</span>
            </div>
            <div className="about__feature reveal">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.5"/><path d="M6 10l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              <span>不鏽鋼櫥櫃 + 高端柚木定製</span>
            </div>
            <div className="about__feature reveal">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.5"/><path d="M6 10l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              <span>服務涵蓋別墅、私樓、居屋、公屋</span>
            </div>
          </div>
          <div className="about__stats reveal">
            <div className="about__stat">
              <div className="about__stat-number">31<span>年</span></div>
              <div className="about__stat-label">行業經驗</div>
            </div>
            <div className="about__stat">
              <div className="about__stat-number">500+</div>
              <div className="about__stat-label">完成項目</div>
            </div>
            <div className="about__stat">
              <div className="about__stat-number">50,000<span>呎</span></div>
              <div className="about__stat-label">自設廠房</div>
            </div>
            <div className="about__stat">
              <div className="about__stat-number">100%</div>
              <div className="about__stat-label">直屬團隊</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Services() {
  const ref = useRef(null);
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray(".services .reveal").forEach((el) => {
        gsap.to(el, {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 85%" },
        });
      });
      gsap.utils.toArray(".service-card").forEach((card, i) => {
        gsap.to(card, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          delay: i * 0.1,
          ease: "power3.out",
          scrollTrigger: { trigger: card, start: "top 88%" },
        });
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  const servicesList = [
    {
      icon: <svg viewBox="0 0 40 40" fill="none"><path d="M6 36V16l14-12 14 12v20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M14 36V24h12v12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
      title: "上門度尺及設計諮詢",
      desc: "專業團隊上門精準度尺，深入了解客戶需求，提供全方位空間規劃建議與3D效果圖。",
    },
    {
      icon: <svg viewBox="0 0 40 40" fill="none"><rect x="6" y="8" width="28" height="24" rx="2" stroke="currentColor" strokeWidth="1.5"/><path d="M6 16h28M14 16V8" stroke="currentColor" strokeWidth="1.5"/><circle cx="12" cy="12" r="1" fill="currentColor"/><circle cx="16" cy="12" r="1" fill="currentColor"/></svg>,
      title: "全屋傢私訂造及裝修",
      desc: "涵蓋不鏽鋼櫥櫃、高端柚木定製及各類板材傢私，自家廠房生產確保品質與工期。",
    },
    {
      icon: <svg viewBox="0 0 40 40" fill="none"><path d="M8 12h24M8 20h24M8 28h24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><circle cx="8" cy="12" r="2" fill="currentColor"/><circle cx="8" cy="20" r="2" fill="currentColor"/><circle cx="8" cy="28" r="2" fill="currentColor"/></svg>,
      title: "高效清拆及現場施工",
      desc: "水電、泥水、油漆、木工一站式管理，自有師傅團隊杜絕轉包，工程進度透明可控。",
    },
    {
      icon: <svg viewBox="0 0 40 40" fill="none"><path d="M6 20l14-14 14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M12 16v18h16V16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M16 34V24h8v10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
      title: "準時送貨及專業安裝",
      desc: "自家物流團隊準時送貨上門，經驗豐富的安裝師傅確保傢私與裝修工程完美落地。",
    },
    {
      icon: <svg viewBox="0 0 40 40" fill="none"><path d="M20 6v28M10 20h20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><circle cx="20" cy="20" r="14" stroke="currentColor" strokeWidth="1.5"/><path d="M14 14l3-3h6l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
      title: "不鏽鋼櫥櫃訂製",
      desc: "自設不鏽鋼櫥櫃展廳及生產線，提供廚房空間設計與高端不鏽鋼櫥櫃訂製服務。",
    },
    {
      icon: <svg viewBox="0 0 40 40" fill="none"><rect x="8" y="6" width="24" height="28" rx="2" stroke="currentColor" strokeWidth="1.5"/><path d="M12 16h16M12 22h12M12 28h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><circle cx="31" cy="31" r="3" fill="currentColor"/></svg>,
      title: "售後保養服務",
      desc: "提供完善售後保養及維修服務，建立長期客戶關係，讓你住得安心、用得放心。",
    },
  ];

  return (
    <section id="services" className="services" ref={ref}>
      <div className="container">
        <span className="section-label reveal">SERVICES</span>
        <h2 className="section-heading reveal">一站式服務流程</h2>
        <p className="section-subheading reveal">
          從上門度尺、設計繪圖、工廠生產到現場安裝，我們將整個流程打通，省去溝通成本，確保品質一致。
        </p>
        <div className="services__grid">
          {servicesList.map((s, i) => (
            <div className="service-card" key={i} style={{ opacity: 0, transform: "translateY(30px)" }}>
              <div className="service-card__icon">{s.icon}</div>
              <h3 className="service-card__title">{s.title}</h3>
              <p className="service-card__desc">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CaseGallery() {
  const [selected, setSelected] = useState(null);
  const featuredRef = useRef(null);
  const shapeRef = useRef(null);
  const cardRefs = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Section header reveals
      gsap.utils.toArray(".case-gallery .reveal").forEach((el) => {
        gsap.to(el, {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 85%" },
        });
      });

      // Featured: clip-path morph on scroll
      if (shapeRef.current) {
        gsap.fromTo(shapeRef.current,
          { clipPath: "inset(3% 4% 3% 4% round 16px)" },
          {
            clipPath: "inset(0% 0% 0% 0% round 0px)",
            ease: "power2.inOut",
            scrollTrigger: {
              trigger: featuredRef.current,
              start: "top 70%",
              end: "bottom 30%",
              scrub: 1.2,
            },
          }
        );
      }

      // Cards: 統一圓角 → 完整矩形
      cardRefs.current.forEach((cardEl, i) => {
        if (!cardEl) return;
        const shapeEl = cardEl.querySelector(".case-morph__card-shape");
        if (!shapeEl) return;

        gsap.fromTo(shapeEl,
          { clipPath: "inset(6% 6% 6% 6% round 32px)" },
          {
            clipPath: "inset(0% 0% 0% 0% round 0px)",
            ease: "power2.inOut",
            scrollTrigger: {
              trigger: cardEl,
              start: "top 82%",
              end: "top 40%",
              scrub: 0.8,
            },
          }
        );
      });
    }, featuredRef);
    return () => ctx.revert();
  }, []);

  function closeLightbox() {
    setSelected(null);
  }

  const otherCases = projectCases.filter(p => !p.featured);

  return (
    <section id="portfolio" className="case-gallery" ref={featuredRef}>
      <div className="container">
        <div className="case-gallery__header reveal">
          <span className="section-label">PORTFOLIO</span>
          <h2 className="section-heading">落地實景案例</h2>
          <p className="section-subheading">
            涵蓋別墅、私樓、居屋、公屋 —— 每一個項目都是我們用心打造的空間故事。
          </p>
        </div>

        {/* Featured project with morphing shape */}
        {projectCases.filter(p => p.featured).map(project => (
          <div className="case-morph__featured reveal" key={project.id}
            onClick={() => setSelected(project)}>
            <div className="case-morph__featured-shape" ref={shapeRef}>
              <img src={project.cover} alt={project.name} loading="lazy"
                onError={(e) => { e.target.src = '/images/hero/建築室内圖片.jpg'; }} />
            </div>
            <div className="case-morph__featured-content">
              <span className="case-morph__featured-tag">{project.style}</span>
              <h3 className="case-morph__featured-name">{project.name}</h3>
              <div className="case-morph__featured-meta">
                <span>{project.location}</span>
                <span className="case-morph__featured-dot">·</span>
                <span>{project.images.length} 張實景圖</span>
              </div>
            </div>
          </div>
        ))}

        {/* Morphing card grid */}
        <div className="case-morph__grid">
          {otherCases.map((project, i) => (
            <div
              className={`case-morph__card case-morph__card--${i} reveal`}
              key={project.id}
              ref={el => cardRefs.current[i] = el}
              onClick={() => setSelected(project)}
            >
              <div className="case-morph__card-shape">
                <img src={project.cover} alt={project.name} loading="lazy"
                  onError={(e) => { e.target.src = '/images/hero/建築室内圖片.jpg'; }} />
              </div>
              <div className="case-morph__card-body">
                <span className="case-morph__card-tag">{project.style}</span>
                <h3 className="case-morph__card-name">{project.name}</h3>
                <div className="case-morph__card-meta">
                  {project.location}
                  <span className="case-morph__card-meta-dot">·</span>
                  {project.images.length} 張實景圖
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {selected && (
        <div className="lightbox" onClick={closeLightbox}>
          <button className="lightbox__close" onClick={closeLightbox}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
          <div className="lightbox__content" onClick={(e) => e.stopPropagation()}>
            <div className="lightbox__header">
              <h2>{selected.name}</h2>
              <span>{selected.location} · {selected.style} · {selected.images.length} 張實景圖</span>
            </div>
            <div className="lightbox__grid">
              {selected.images.map((img, i) => (
                <img key={i} src={img} alt={`${selected.name} ${i + 1}`} loading="lazy"
                  onError={(e) => { e.target.style.display = 'none'; }} />
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function Showcase() {
  const [selected, setSelected] = useState(null);
  const ref = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray(".showcase .reveal").forEach((el) => {
        gsap.to(el, {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 85%" },
        });
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  function closeLightbox() {
    setSelected(null);
  }

  return (
    <section id="showcase" className="showcase" ref={ref}>
      <div className="container">
        <div className="showcase__header reveal">
          <span className="section-label">SHOWCASE</span>
          <h2 className="section-heading">廠房及展廳</h2>
          <p className="section-subheading">
            自家廠房生產，品質由源頭掌控 —— 從設備到工藝，全面展示我們的實力。
          </p>
        </div>

        <div className="showcase__grid">
          {showcaseItems.map(item => (
            <div className="showcase__item reveal" key={item.id}
              onClick={() => setSelected(item)}>
              <div className="showcase__item-img">
                <img src={item.cover} alt={item.name} loading="lazy"
                  onError={(e) => { e.target.src = '/images/hero/建築室内圖片.jpg'; }} />
              </div>
              <div className="showcase__item-body">
                <h3 className="showcase__item-name">{item.name}</h3>
                <p className="showcase__item-subtitle">{item.subtitle}</p>
                <p className="showcase__item-desc">{item.desc}</p>
                <span className="showcase__item-link">
                  瀏覽更多
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M1 11L11 1m0 0H3m8 0v8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selected && (
        <div className="lightbox" onClick={closeLightbox}>
          <button className="lightbox__close" onClick={closeLightbox}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
          <div className="lightbox__content" onClick={(e) => e.stopPropagation()}>
            <div className="lightbox__header">
              <h2>{selected.name}</h2>
              <span>{selected.subtitle}</span>
            </div>
            <div className="lightbox__grid">
              {selected.images.map((img, i) => (
                <img key={i} src={img} alt={`${selected.name} ${i + 1}`} loading="lazy"
                  onError={(e) => { e.target.style.display = 'none'; }} />
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function Partners() {
  const ref = useRef(null);
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray(".partners .reveal").forEach((el) => {
        gsap.to(el, {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 85%" },
        });
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  const partnerLogos = [
    { name: "Hettich 海蒂詩", file: "Hettich 海蒂詩 logo.png" },
    { name: "BLUM 百隆", file: "百隆logo.png" },
    { name: "SALICE 薩郦奇", file: "SALICE 薩郦奇logo.png" },
    { name: "REHAU", file: "REHAUlogo.png" },
    { name: "HUALI 華立", file: "HUALI 華立股份logo.png" },
    { name: "Jowat", file: "Jowat logo.png" },
    { name: "Italiana Ferramenta", file: "Italiana Ferramenta logo.png" },
    { name: "BASISTEMR", file: "BASISTEMRlogo.png" },
    { name: "BERNECK", file: "BERNECKlogo.png" },
    { name: "HAWA", file: "Hawa logo.png" },
    { name: "LiteMax", file: "LiteMaxlogo.png" },
    { name: "TAIFOO 泰孚", file: "TAIFOO 泰孚logo.png" },
    { name: "天斯 TIANSI", file: "天斯logo.png" },
    { name: "庫博 UNIHOP", file: "庫博logo.png" },
    { name: "HIGOLD 焊高", file: "焊高logo.png" },
  ];

  return (
    <section id="partners" className="partners" ref={ref}>
      <div className="container">
        <span className="section-label reveal">PARTNERS</span>
        <h2 className="section-heading reveal">合作夥伴</h2>
        <p className="section-subheading reveal">
          我們與國際一線五金及板材品牌長期合作，確保每一件出品都採用優質材料。
        </p>
        <div className="partners__grid reveal">
          {partnerLogos.map((partner, i) => (
            <div className="partners__item" key={i}>
              <img src={`/images/partners/${partner.file}`} alt={partner.name} loading="lazy"
                onError={(e) => { e.target.style.display = 'none'; }} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Contact() {
  const ref = useRef(null);
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray(".contact .reveal").forEach((el) => {
        gsap.to(el, {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 85%" },
        });
      });
    }, ref);
    return () => ctx.revert();
  }, []);
  return (
    <section id="contact" className="contact" ref={ref}>
      <div className="container">
        <span className="section-label reveal">CONTACT</span>
        <h2 className="section-heading reveal">聯絡我們</h2>
        <p className="section-subheading reveal">
          無論是新屋裝修、舊屋翻新，還是局部定制，歡迎預約免費上門度尺及諮詢。
        </p>
        <div className="contact__info reveal">
          <div className="contact__item">
            <div className="contact__item-icon">
              <img src="/images/icons/icon-address.png" alt="地址" width="24" height="24" />
            </div>
            <div className="contact__item-label">地址</div>
            <div className="contact__item-value">
              香港新界荃灣楊屋道88號<br />6樓610室
            </div>
          </div>
          <div className="contact__item">
            <div className="contact__item-icon">
              <img src="/images/icons/icon-email.png" alt="電郵" width="24" height="24" />
            </div>
            <div className="contact__item-label">電郵</div>
            <div className="contact__item-value">Kwongyikrenovationengineering<br />@gmail.com</div>
          </div>
          <div className="contact__item">
            <div className="contact__item-icon">
              <img src="/images/icons/icon-phone.png" alt="電話" width="24" height="24" />
            </div>
            <div className="contact__item-label">電話 / WhatsApp</div>
            <div className="contact__item-value">
              <a href="tel:+85295187920">+852 9518 7920</a><br />
              <span className="contact__item-sub">+852 6333 5178</span>
            </div>
          </div>
          <div className="contact__item">
            <div className="contact__item-icon">
              <img src="/images/icons/icon-wechat.png" alt="微信" width="24" height="24" />
            </div>
            <div className="contact__item-label">微信</div>
            <div className="contact__item-value">haoming10</div>
          </div>
        </div>
        <a href="https://wa.me/85295187920" target="_blank" rel="noopener noreferrer" className="contact__cta reveal">
          WhatsApp 預約諮詢
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 1l7 3-7 3-7-3 7-3z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/><path d="M1 4v8l7 3V7L1 4z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/><path d="M15 4v8l-7 3V7L15 4z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </a>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="footer__grid">
        <div>
          <div className="footer__brand">KWONG YIK</div>
          <p className="footer__tagline">
            廣翊全屋傢私訂造及裝修工程服務有限公司
            <br /><br />
            Kwong Yik Whole House Furniture Customisation<br />
            &amp; Renovation Engineering Service Co., Limited<br /><br />
            自1995年，用心打造每一個家。
          </p>
        </div>
        <div>
          <div className="footer__col-title">服務</div>
          <ul className="footer__links">
            <li><a href="#services">上門度尺</a></li>
            <li><a href="#services">全屋定制</a></li>
            <li><a href="#services">裝修工程</a></li>
            <li><a href="#services">不鏽鋼櫥櫃</a></li>
            <li><a href="#services">專業安裝</a></li>
          </ul>
        </div>
        <div>
          <div className="footer__col-title">公司</div>
          <ul className="footer__links">
            <li><a href="#about">關於我們</a></li>
            <li><a href="#portfolio">精選案例</a></li>
            <li><a href="#showcase">廠房展廳</a></li>
            <li><a href="#partners">合作夥伴</a></li>
            <li><a href="#contact">聯絡我們</a></li>
          </ul>
        </div>
        <div>
          <div className="footer__col-title">關注我們</div>
          <ul className="footer__links">
            <li><a href="https://wa.me/85295187920" target="_blank" rel="noopener">WhatsApp</a></li>
            <li><a href="#" target="_blank" rel="noopener">Facebook</a></li>
            <li><a href="#" target="_blank" rel="noopener">Instagram</a></li>
            <li><a href="#" target="_blank" rel="noopener">小紅書</a></li>
            <li><a href="#" target="_blank" rel="noopener">抖音 TikTok</a></li>
          </ul>
        </div>
      </div>
      <div className="footer__bottom">
        <span className="footer__copyright">© 2025 廣翊全屋傢私訂造及裝修工程服務有限公司 Kwong Yik. All rights reserved.</span>
      </div>
    </footer>
  );
}

/* ===== MAIN APP ===== */
export default function App() {
  return (
    <div>
      <Header />
      <Hero />
      <About />
      <Services />
      <CaseGallery />
      <Showcase />
      <Partners />
      <Contact />
      <Footer />
    </div>
  );
}
