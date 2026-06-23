import { useEffect, useState, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import heroImg from "./assets/hero.jpg";
import "./App.css";

gsap.registerPlugin(ScrollTrigger);

/* ===== 項目數據 ===== */
const projects = [
  { id: "tko", name: "將軍澳彩明苑D座901室", district: "將軍澳", area: "901呎" },
  { id: "tm", name: "屯門 黃金海灣F室", district: "屯門", area: "F室" },
  { id: "hh", name: "港灣豪庭7座34F", district: "大角咀", area: "34F" },
  { id: "np", name: "牛池灣警察宿舍1座22", district: "牛池灣", area: "22樓" },
  { id: "mf", name: "美孚新邨113 3C", district: "美孚", area: "3C室" },
  { id: "ct1", name: "翔東村翔月樓1201", district: "翔東村", area: "1201室" },
  { id: "ct2", name: "翔東村翔輝樓1621室", district: "翔東村", area: "1621室" },
];

const chartTypes = [
  { key: "01_柱状图", label: "柱狀圖", emoji: "📊" },
  { key: "02_饼图", label: "餅圖", emoji: "🥧" },
  { key: "03_折线图", label: "折線圖", emoji: "📈" },
  { key: "04_环形图", label: "環形圖", emoji: "⭕" },
  { key: "05_进度条", label: "進度條", emoji: "📶" },
  { key: "06_雷达图", label: "雷達圖", emoji: "🕸️" },
];

function getChartUrl(projectName, chartKey) {
  const safeName = projectName.replace(/ /g, " "); // keep space as-is for filenames
  return `/charts/${chartKey}_${safeName}.png`;
}

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
      <div className="header__brand">廣翊</div>
      <nav>
        <ul className="header__nav">
          <li><a href="#about">關於</a></li>
          <li><a href="#services">服務</a></li>
          <li><a href="#portfolio">作品</a></li>
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
      gsap.to(".hero__bg img", {
        y: -30,
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
        <span className="hero__tag">香港 · 28年經驗</span>
        <h1 className="hero__headline">
          空間，由<em>工藝</em>塑造
        </h1>
        <p className="hero__subline">
          專注高端室內設計與全屋定制，我們相信每一個空間都承載著生活的溫度。自家工廠直營，從設計到生產一體化服務。
        </p>
        <a href="#portfolio" className="hero__cta">
          探索作品
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 3v10m0 0l4-4m-4 4l-4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </a>
        <div className="hero__trust">
          <span className="hero__trust-item">全屋定制</span>
          <span className="hero__trust-item">自家生產</span>
          <span className="hero__trust-item">設計+施工</span>
          <span className="hero__trust-item">一條龍服務</span>
        </div>
      </div>
      <div className="hero__scroll">
        <span>滾動</span>
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
            <span className="section-label reveal">關於廣翊</span>
            <h2 className="section-heading reveal">二十八年，只做一件事</h2>
            <p className="reveal">
              廣翊全屋傢俬訂造及裝修工程服務有限公司成立於1996年，紮根香港近三十年。
              我們擁有自家生產線，從設計繪圖、板材切割、封邊處理到現場安裝，全程品質掌控。
              不做中介，不外包——每一個細節都由我們親手完成。
            </p>
            <p className="reveal">
              我們相信好的空間設計不在於華麗的堆砌，而是對生活方式的深度理解。
              你的家，值得被認真對待。
            </p>
          </div>
          <div className="about__stats reveal">
            <div className="about__stat">
              <div className="about__stat-number">28+</div>
              <div className="about__stat-label">年行業經驗</div>
            </div>
            <div className="about__stat">
              <div className="about__stat-number">500+</div>
              <div className="about__stat-label">完成項目</div>
            </div>
            <div className="about__stat">
              <div className="about__stat-number">自家</div>
              <div className="about__stat-label">工廠直營</div>
            </div>
            <div className="about__stat">
              <div className="about__stat-number">100%</div>
              <div className="about__stat-label">客戶滿意</div>
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
          delay: i * 0.15,
          ease: "power3.out",
          scrollTrigger: { trigger: card, start: "top 88%" },
        });
      });
    }, ref);
    return () => ctx.revert();
  }, []);
  const servicesList = [
    {
      icon: "🏠",
      title: "全屋定制",
      desc: "從玄關到臥室，一體化空間規劃。量身打造收納系統、櫃體設計、活動傢俬，最大化每一寸空間的使用效率。",
    },
    {
      icon: "🎨",
      title: "室內設計",
      desc: "專業設計團隊繪製3D效果圖，從現代簡約到輕奢風格，確保設計方案與實際完工效果高度一致。",
    },
    {
      icon: "🔨",
      title: "裝修工程",
      desc: "水電、泥水、油漆、木工一站式施工管理。自有師傅團隊，工程進度透明可控，杜絕轉包偷工減料。",
    },
  ];
  return (
    <section id="services" className="services" ref={ref}>
      <div className="container">
        <span className="section-label reveal">服務範圍</span>
        <h2 className="section-heading reveal">設計 · 生產 · 施工，一站完成</h2>
        <p className="section-subheading reveal">
          不用分別找設計師、傢俬廠和裝修師傅。我們把整個流程打通，省去溝通成本，確保每個環節的品質一致。
        </p>
        <div className="services__grid">
          {servicesList.map((s, i) => (
            <div className="service-card reveal" key={i} style={{ opacity: 0, transform: "translateY(30px)" }}>
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

function Portfolio() {
  const [activeTab, setActiveTab] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray(".portfolio .reveal").forEach((el) => {
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

  // Animate cards when tab changes
  useEffect(() => {
    const cards = ref.current?.querySelectorAll(".project-card");
    if (cards) {
      gsap.fromTo(
        cards,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.08, ease: "power3.out" }
      );
    }
  }, [activeTab]);

  const currentChartType = chartTypes[activeTab];

  return (
    <section id="portfolio" className="portfolio" ref={ref}>
      <div className="container">
        <div className="portfolio__header">
          <span className="section-label reveal">精選作品</span>
          <h2 className="section-heading reveal">七大項目，全方位數據展示</h2>
          <p className="section-subheading reveal">
            每個項目包含六種可視化圖表：柱狀圖、餅圖、折線圖、環形圖、進度條及雷達圖，全面追蹤工程預算與進度。
          </p>
        </div>
        <div className="portfolio__tabs reveal">
          {chartTypes.map((ct, i) => (
            <button
              key={ct.key}
              className={`portfolio__tab ${i === activeTab ? "portfolio__tab--active" : ""}`}
              onClick={() => setActiveTab(i)}
            >
              {ct.emoji} {ct.label}
            </button>
          ))}
        </div>
        <div className="portfolio__projects">
          {projects.map((proj) => (
            <div className="project-card" key={proj.id}>
              <div className="project-card__image">
                <img
                  src={getChartUrl(proj.name, currentChartType.key)}
                  alt={`${proj.name} - ${currentChartType.label}`}
                  loading="lazy"
                />
              </div>
              <div className="project-card__info">
                <h3 className="project-card__name">{proj.name}</h3>
                <span className="project-card__type">
                  {proj.district} · {proj.area} · {currentChartType.label}
                </span>
              </div>
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
        <span className="section-label reveal">聯絡我們</span>
        <h2 className="section-heading reveal">開啟你的空間改造之旅</h2>
        <p className="section-subheading reveal">
          無論是新屋裝修、舊屋翻新，還是局部定制，歡迎預約免費上門度尺及諮詢。
        </p>
        <div className="contact__info reveal">
          <div className="contact__item">
            <div className="contact__item-label">電話</div>
            <div className="contact__item-value">+852 1234 5678</div>
          </div>
          <div className="contact__item">
            <div className="contact__item-label">電郵</div>
            <div className="contact__item-value">info@guangyi.hk</div>
          </div>
          <div className="contact__item">
            <div className="contact__item-label">地址</div>
            <div className="contact__item-value">香港九龍灣宏照道</div>
          </div>
        </div>
        <a href="tel:+85212345678" className="contact__cta reveal">
          預約免費諮詢
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
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
          <div className="footer__brand">廣翊</div>
          <p className="footer__tagline">
            廣翊全屋傢俬訂造及裝修工程服務有限公司
            <br />
            二十八年，用心打造每一個家。
          </p>
        </div>
        <div>
          <div className="footer__col-title">服務</div>
          <ul className="footer__links">
            <li><a href="#services">全屋定制</a></li>
            <li><a href="#services">室內設計</a></li>
            <li><a href="#services">裝修工程</a></li>
          </ul>
        </div>
        <div>
          <div className="footer__col-title">公司</div>
          <ul className="footer__links">
            <li><a href="#about">關於我們</a></li>
            <li><a href="#portfolio">精選作品</a></li>
            <li><a href="#contact">聯絡我們</a></li>
          </ul>
        </div>
        <div>
          <div className="footer__col-title">關注</div>
          <ul className="footer__links">
            <li><a href="#">Facebook</a></li>
            <li><a href="#">Instagram</a></li>
            <li><a href="#">WhatsApp</a></li>
          </ul>
        </div>
      </div>
      <div className="footer__bottom">
        <span className="footer__copyright">© 2024 廣翊全屋傢俬訂造及裝修工程服務有限公司. All rights reserved.</span>
        <ul className="footer__legal">
          <li><a href="#">私隱政策</a></li>
          <li><a href="#">使用條款</a></li>
        </ul>
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
      <Portfolio />
      <Contact />
      <Footer />
    </div>
  );
}
