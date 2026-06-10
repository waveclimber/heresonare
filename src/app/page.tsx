"use client";

import { useState } from "react";
import Navbar from "../components/Navbar";
import Hero from "@/components/Hero";
import Products from "@/components/Products";
import About from "@/components/About";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  
  const [language, setLanguage] = useState("EN");
  const content = {
    EN: {
      heroTitle: "héReSonare",
      heroSubtitle: "Sound Beyond Boundaries",
      heroDescription: "Let sound and creativity resonate freely.",
      explore: "Explore",
      navProducts: "Products",
      navAbout: "About",
      navContact: "Contact",
      productsTitle: "Products",
      product1Title: "Audio Innovation",
      product1Text: "Next-generation sound technology designed to inspire creativity and human connection.",
      product2Title: "Creative Resonance",
      product2Text: "Creating meaningful connections through sound, design and technology.",
      product3Title: "Future Experience",
      product3Text: "Exploring new possibilities where creativity, emotion and innovation meet.",
      aboutTag: "About héReSonare",
      aboutTitle: "Creating resonance between sound, emotion and technology.",
      aboutText1:
              "héReSonare believes that sound is more than a medium of communication. It is a bridge connecting creativity, emotion, technology and human experience.",
      aboutText2:
              "Through artistic expression and technological innovation, we explore new ways for people, brands and communities to resonate with each other.",
      contactTag: "Contact",
      contactTitle: "Let's Create Resonance Together",
      contactText:
              "Whether you are a creator, partner or innovator, we would love to hear from you.",
      footerSlogan: "Sound Beyond Boundaries",
      footerCopyright: "© 2026 héReSonare. All rights reserved.",
    },
  
    JP: {
      heroTitle: "héReSonare",
      heroSubtitle: "Sound Beyond Boundaries",
      heroDescription: "音と創造性が自由に共鳴する。",
      explore: "探索する",
      navProducts: "製品",
      navAbout: "会社概要",
      navContact: "お問い合わせ",
      productsTitle: "製品",
      product1Title: "音響イノベーション",
      product1Text: "創造性と人とのつながりを刺激する、次世代のサウンドテクノロジー。",
      product2Title: "創造的な共鳴",
      product2Text: "音、デザイン、テクノロジーを通じて意味のあるつながりを生み出します。",
      product3Title: "未来の体験",
      product3Text: "創造性、感情、革新が交わる新しい可能性を探求します。",
      aboutTag: "héReSonareについて",
      aboutTitle: "音、感情、テクノロジーの共鳴を創造する。",
      aboutText1:
          "héReSonareは、音を単なるコミュニケーション手段ではなく、創造性・感情・技術・人間体験をつなぐ架け橋だと考えています。",
      aboutText2:
          "芸術表現と技術革新を通じて、人々、ブランド、コミュニティが共鳴する新しい方法を探求します。",
          contactTag: "お問い合わせ",
          contactTitle: "共に新しい共鳴を創りましょう",
          contactText:
          "クリエイター、パートナー、イノベーターの皆様からのご連絡をお待ちしております。",
      footerSlogan: "Sound Beyond Boundaries",
      footerCopyright: "© 2026 héReSonare. All rights reserved.",
    },
  
    CN: {
      heroTitle: "héReSonare",
      heroSubtitle: "Sound Beyond Boundaries",
      heroDescription: "让声音与创造力自由共鸣",
      explore: "探索",
      navProducts: "产品",
      navAbout: "关于我们",
      navContact: "联系我们",
      productsTitle: "产品",
      product1Title: "声音创新",
      product1Text: "以新一代声音技术激发创造力与人与人之间的连接。",
      product2Title: "创意共鸣",
      product2Text: "通过声音、设计与技术，创造有意义的连接。",
      product3Title: "未来体验",
      product3Text: "探索创造力、情感与创新交汇处的全新可能。",
      aboutTag: "关于 héReSonare",
      aboutTitle: "创造声音、情感与科技之间的共鸣。",
      aboutText1:
          "héReSonare 认为声音不仅仅是传播媒介，它是连接创造力、情感、技术与人类体验的桥梁。",
      aboutText2:
          "通过艺术表达与技术创新，我们探索人与人、品牌与社区之间产生共鸣的新方式。",
      contactTag: "联系我们",
      contactTitle: "一起创造新的共鸣",
      contactText:
          "无论您是创作者、合作伙伴还是创新者，我们都期待与您交流。",
      footerSlogan: "超越边界的声音",
      footerCopyright: "© 2026 héReSonare. 保留所有权利。",
    },
  };

  return (
    <main className="min-h-screen bg-black text-white">
      
      <Navbar
  content={content}
  language={language}
  setLanguage={setLanguage}
/>

      <Hero content={content} language={language} />

      <Products
        content={content}
        language={language}
      />


      <About
        content={content}
        language={language}
      />

      <Contact content={content} language={language} />

      <Footer content={content} language={language} />

    </main>
  );
}