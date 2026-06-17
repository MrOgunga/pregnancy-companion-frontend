import HeroIllustration from "./_components/HeroIllustration";
import VideoEmbed from "./_components/VideoEmbed";
import ScrollReveal from "./_components/ScrollReveal";
import BumplyChat from "./_components/BumplyChat";
import RegisterForm from "./_components/RegisterForm";
import LanguageSwitcher from "./_components/LanguageSwitcher";
import { DEV_STAGES } from "@/lib/babyImages";
import { getUiLang } from "@/lib/serverLang";
import { t } from "@/lib/i18n";

export default async function Home() {
  const L = await getUiLang();
  return (
    <>
      <nav>
        <div className="nav-inner">
          <div className="logo">
            <div className="logo-dot" />
            Bumply
          </div>
          <ul className="nav-links">
            <li><a href="#how">{t("home.nav.how", L)}</a></li>
            <li><a href="#features">{t("home.nav.features", L)}</a></li>
            <li><a href="#stories">{t("home.nav.stories", L)}</a></li>
            <li><a href="/login">{t("home.nav.signin", L)}</a></li>
          </ul>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <LanguageSwitcher lang={L} compact />
            <a href="#register" className="nav-cta">{t("home.nav.start", L)}</a>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero" id="home">
        <div className="hero-bg">
          <div className="hero-orb orb1" />
          <div className="hero-orb orb2" />
          <div className="hero-orb orb3" />
        </div>
        <div className="hero-inner">
          <div>
            <div className="hero-eyebrow"><div className="eyebrow-dot" />{t("home.hero.eyebrow", L)}</div>
            <h1 className="hero-h">
              {t("home.hero.l1", L)}<br />
              <em>{t("home.hero.l2", L)}</em><br />
              <span className="lav">{t("home.hero.l3", L)}</span>
            </h1>
            <p className="hero-p">{t("home.hero.p", L)}</p>
            <div className="hero-btns">
              <a className="btn-pink" href="#register">{t("home.hero.cta1", L)}</a>
              <a className="btn-ghost" href="#how">{t("home.hero.cta2", L)}</a>
            </div>
            <div className="hero-trust">
              <div className="trust-item"><div className="trust-icon">🌸</div><div className="trust-text">{t("home.hero.t1", L)}</div></div>
              <div className="trust-item"><div className="trust-icon">🥗</div><div className="trust-text">{t("home.hero.t2", L)}</div></div>
              <div className="trust-item"><div className="trust-icon">💌</div><div className="trust-text">{t("home.hero.t3", L)}</div></div>
            </div>
          </div>

          <div className="hero-right">
            <div className="float-pill fp-weight">
              <div className="pill-label">Baby weight</div>
              <div className="pill-val">14 grams 🌱</div>
            </div>
            <div className="float-pill fp-size">
              <div className="pill-label">Size this week</div>
              <div className="pill-val">🍋 A lime</div>
            </div>
            <HeroIllustration />
            <div className="float-pill fp-week">
              <div className="pill-label">You are in</div>
              <div className="pill-big">12</div>
              <div className="pill-sub">Weeks ✓</div>
            </div>
            <div className="float-pill fp-sent">
              <div className="pill-label">Weekly update</div>
              <div className="pill-val">Sent Monday ✓</div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how">
        <div className="wrap">
          <div className="how-header reveal">
            <p className="s-label">{t("home.nav.how", L)}</p>
            <h2 className="s-title">{t("home.how.title", L)}</h2>
            <p className="s-sub">{t("home.how.sub", L)}</p>
          </div>
          <VideoEmbed />
          <div className="steps-grid reveal">
            <div className="step-card">
              <div className="step-num">01</div>
              <div className="step-title">Register your details</div>
              <div className="step-desc">Fill in your name, due date, dietary needs and partner&apos;s name. Takes under 2 minutes.</div>
            </div>
            <div className="step-card">
              <div className="step-num">02</div>
              <div className="step-title">Bumply calculates your week</div>
              <div className="step-desc">The system reads your current gestational week and generates a fully personalised update just for you.</div>
            </div>
            <div className="step-card">
              <div className="step-num">03</div>
              <div className="step-title">Your beautiful page arrives</div>
              <div className="step-desc">Your baby&apos;s size, development, 7-day meal plan, fetal image, and a special note for your partner — all in one place.</div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features">
        <div className="wrap">
          <div className="reveal">
            <p className="s-label">{t("home.features.label", L)}</p>
            <h2 className="s-title">{t("home.features.title", L)}</h2>
          </div>
          <div className="features-grid reveal">
            <div className="feat-card fc-pink">
              <div className="feat-icon">👶</div>
              <div className="feat-title">{t("home.feat1.title", L)}</div>
              <div className="feat-desc">See your baby&apos;s actual size, weight and length with a real fetal image for your stage of pregnancy — from a single cell to a fully formed little one.</div>
              <span className="feat-tag">Visual · Medical-grade</span>
            </div>
            <div className="feat-card fc-lav">
              <div className="feat-icon">🥗</div>
              <div className="feat-title">{t("home.feat2.title", L)}</div>
              <div className="feat-desc">Every meal tailored to your trimester, dietary restrictions and what your baby needs most that specific week.</div>
              <span className="feat-tag">AI-generated · Weekly</span>
            </div>
            <div className="feat-card fc-blue">
              <div className="feat-icon">💌</div>
              <div className="feat-title">{t("home.feat3.title", L)}</div>
              <div className="feat-desc">A warm, personal message sent directly to your partner — by name — on what&apos;s happening with the baby and how to support you.</div>
              <span className="feat-tag">Personalised · Heartfelt</span>
            </div>
            <div className="feat-card fc-gold">
              <div className="feat-icon">🎯</div>
              <div className="feat-title">{t("home.feat4.title", L)}</div>
              <div className="feat-desc">Special messages at week 13, 27 and 40 — your trimester completions — to celebrate how far you&apos;ve come.</div>
              <span className="feat-tag">Automated · Celebratory</span>
            </div>
          </div>
        </div>
      </section>

      {/* WATCH BABY GROW */}
      <section id="grow">
        <div className="wrap">
          <div className="how-header reveal">
            <p className="s-label">{t("home.grow.label", L)}</p>
            <h2 className="s-title">{t("home.grow.title", L)}</h2>
            <p className="s-sub">{t("home.grow.sub", L)}</p>
          </div>
          <div className="grow-grid reveal">
            {DEV_STAGES.map((s) => (
              <figure className="grow-card" key={s.file}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`/baby/${s.file}`} alt={s.caption} loading="lazy" />
                <figcaption>
                  <span className="grow-week">{s.label}</span>
                  <span className="grow-cap">{s.caption}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* REGISTER */}
      <section id="register">
        <div className="wrap">
          <div className="register-layout">
            <div className="reveal">
              <p className="s-label">{t("home.reg.label", L)}</p>
              <h2 className="reg-side-title">{t("dash.journey", L)}</h2>
              <p className="reg-side-p">{t("home.reg.p", L)}</p>
              <div className="promise-list">
                <div className="promise-row">
                  <div className="p-icon pink">🌸</div>
                  <div><div className="p-name">Weekly updates, week 1 to 40</div><div className="p-desc">A new personalised page every week, kept in your dashboard.</div></div>
                </div>
                <div className="promise-row">
                  <div className="p-icon lav">🔒</div>
                  <div><div className="p-name">Private and secure</div><div className="p-desc">Your account, your data — never shared with anyone.</div></div>
                </div>
                <div className="promise-row">
                  <div className="p-icon blue">💙</div>
                  <div><div className="p-name">Free during beta</div><div className="p-desc">Premium chat &amp; meal plans unlock with a subscription.</div></div>
                </div>
              </div>
            </div>
            <div className="reveal d2">
              <RegisterForm />
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="stories">
        <div className="wrap">
          <div className="reveal">
            <p className="s-label">{t("home.stories.label", L)}</p>
            <h2 className="s-title">From the mamas <em>themselves</em></h2>
          </div>
          <div className="testi-grid reveal">
            <div className="testi-card">
              <div className="testi-stars">★★★★★</div>
              <div className="testi-text">&quot;The meal plans alone are worth it. Every Monday feels like getting a gift. My husband loved his personalised note — he actually cried.&quot;</div>
              <div className="testi-author"><div className="testi-avatar av1">👩🏾</div><div><div className="testi-name">Chiamaka O.</div><div className="testi-week">Week 28 · Lagos</div></div></div>
            </div>
            <div className="testi-card">
              <div className="testi-stars">★★★★★</div>
              <div className="testi-text">&quot;Seeing my baby&apos;s actual photo every week makes it so real. I didn&apos;t know what a 14-week baby looked like until Bumply showed me.&quot;</div>
              <div className="testi-author"><div className="testi-avatar av2">👩🏽</div><div><div className="testi-name">Fatima A.</div><div className="testi-week">Week 19 · Abuja</div></div></div>
            </div>
            <div className="testi-card">
              <div className="testi-stars">★★★★★</div>
              <div className="testi-text">&quot;First pregnancy and I was terrified. The reassurance notes for first-time moms made me feel so seen. I genuinely look forward to Mondays.&quot;</div>
              <div className="testi-author"><div className="testi-avatar av3">👩🏿</div><div><div className="testi-name">Blessing N.</div><div className="testi-week">Week 11 · Port Harcourt</div></div></div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="wrap">
          <div className="foot-grid">
            <div>
              <div className="foot-logo">Bumply <span>Companion</span></div>
              <p className="foot-desc">{t("home.foot.desc", L)}</p>
            </div>
            <div>
              <div className="foot-col-title">Navigate</div>
              <ul className="foot-links">
                <li><a href="#how">{t("home.nav.how", L)}</a></li>
                <li><a href="#features">{t("home.nav.features", L)}</a></li>
                <li><a href="#stories">{t("home.stories.label", L)}</a></li>
                <li><a href="/login">{t("home.nav.signin", L)}</a></li>
              </ul>
            </div>
            <div>
              <div className="foot-col-title">Built by</div>
              <ul className="foot-links">
                <li><a href="https://thebrandnerve.com" target="_blank">The Brand NERVE</a></li>
                <li><a href="mailto:thebrandnerve@gmail.com">thebrandnerve@gmail.com</a></li>
              </ul>
            </div>
          </div>
          <div className="foot-bottom">
            <div className="foot-copy">© 2025 Bumply. Built with love for every mama.</div>
            <div className="foot-copy">Powered by Next.js · NVIDIA · Supabase</div>
          </div>
        </div>
      </footer>

      <BumplyChat />
      <ScrollReveal />
    </>
  );
}
