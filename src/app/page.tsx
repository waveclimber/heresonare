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
      heroSubtitle: "Resonate with the Future",
      heroDescription:
        "An entertainment and creative platform where music, artists and imagination come together.",
        discover: "Discover",
      contactButton: "Contact",
    
      productsTitle: "Products",
      product1Title: "Audio Innovation",
      product1Text:
        "Next-generation sound technology designed to inspire creativity and human connection.",
      product2Title: "Creative Resonance",
      product2Text:
        "Creating meaningful connections through sound, design and technology.",
      product3Title: "Future Experience",
      product3Text:
        "Exploring new possibilities where creativity, emotion and innovation meet.",
    
      featuredTitle: "Featured Content",
    
      featuredArtistsTitle: "ARTISTS",
      featuredArtistsText:
        "Discover the talents shaping the future of sound.",
    
      featuredMusicTitle: "MUSIC",
      featuredMusicText:
        "Explore releases and sonic experiences.",
    
      featuredProductionsTitle: "PRODUCTIONS",
      featuredProductionsText:
        "Creative production and sound design services for new forms of expression.",
    
      aboutTag: "About héReSonare",
      aboutTitle: "Where sound becomes resonance.",
      aboutText1:
        "héReSonare believes that sound is more than a medium of communication. It is a bridge connecting creativity, emotion, technology and human experience.",
      aboutText2:
        "Through artistic expression and technological innovation, we explore new ways for people, brands and communities to resonate with each other.",
    
      aboutStoryTitle: "Brand Story",
      aboutStoryText:
        "Born from the idea of resonance, héReSonare explores how sound, creativity and technology can shape meaningful experiences.",
    
      aboutMissionTitle: "Mission",
      aboutMissionText:
        "To create experiences that resonate beyond boundaries.",
    
      aboutVisionTitle: "Vision",
      aboutVisionText:
        "To become a global creative technology brand connecting people through sound, emotion and innovation.",
    
      contactTag: "Contact",
      contactTitle: "Let's Create Resonance Together",
      contactText:
        "Whether you are a creator, partner or innovator, we would love to hear from you.",
    
      footerSlogan: "Sound Beyond Boundaries",
      footerCopyright:
        "© 2026 héReSonare. All rights reserved.",
    },

    JP: {
      heroTitle: "héReSonare",
      heroSubtitle: "未来と共鳴する。",
      heroDescription:
        "音楽、アーティスト、そして創造性が交差するエンターテインメントとクリエイティブのプラットフォーム。",
        discover: "探索する",
      contactButton: "お問い合わせ",
    
      productsTitle: "製品",
      product1Title: "音響イノベーション",
      product1Text:
        "創造性と人とのつながりを刺激する、次世代のサウンドテクノロジー。",
      product2Title: "創造的な共鳴",
      product2Text:
        "音、デザイン、テクノロジーを通じて意味のあるつながりを生み出します。",
      product3Title: "未来の体験",
      product3Text:
        "創造性、感情、革新が交わる新しい可能性を探求します。",
    
      featuredTitle: "注目コンテンツ",
    
      featuredArtistsTitle: "アーティスト",
      featuredArtistsText:
        "未来のサウンドを形づくるアーティストたちをご紹介します。",
    
      featuredMusicTitle: "音楽",
      featuredMusicText:
        "最新リリースと新しいサウンド体験を探求します。",
    
      featuredProductionsTitle: "プロダクション",
      featuredProductionsText:
        "新しい表現のためのクリエイティブ制作とサウンドデザインを提供します。",
    
      aboutTag: "héReSonareについて",
      aboutTitle: "音が共鳴へと変わる場所。",
      aboutText1:
        "héReSonareは、音を単なるコミュニケーション手段ではなく、創造性・感情・技術・人間体験をつなぐ架け橋だと考えています。",
      aboutText2:
        "芸術表現と技術革新を通じて、人々、ブランド、コミュニティが共鳴する新しい方法を探求します。",
    
      aboutStoryTitle: "ブランドストーリー",
      aboutStoryText:
        "共鳴という思想から生まれた héReSonare は、音・創造性・テクノロジーがどのように意味ある体験を形づくるかを探求します。",
    
      aboutMissionTitle: "ミッション",
      aboutMissionText:
        "境界を越えて共鳴する体験を創造すること。",
    
      aboutVisionTitle: "ビジョン",
      aboutVisionText:
        "音、感情、革新を通じて人々をつなぐ、グローバルなクリエイティブ・ブランドを目指します。",
    
      contactTag: "お問い合わせ",
      contactTitle: "共に新しい共鳴を創りましょう",
      contactText:
        "クリエイター、パートナー、イノベーターの皆様からのご連絡をお待ちしております。",
    
      footerSlogan: "Sound Beyond Boundaries",
      footerCopyright:
        "© 2026 héReSonare. All rights reserved.",
    },
    CN: {
      heroTitle: "héReSonare",
      heroSubtitle: "与未来共鸣",
      heroDescription:
        "一个汇聚音乐、艺人与创造力的娱乐与创意平台。",
        discover: "探索",
      contactButton: "联系我们",
    
      productsTitle: "产品",
      product1Title: "声音创新",
      product1Text:
        "以新一代声音技术激发创造力与人与人之间的连接。",
      product2Title: "创意共鸣",
      product2Text:
        "通过声音、设计与技术，创造有意义的连接。",
      product3Title: "未来体验",
      product3Text:
        "探索创造力、情感与创新交汇处的全新可能。",
    
      featuredTitle: "精选内容",
    
      featuredArtistsTitle: "艺人",
      featuredArtistsText:
        "探索正在塑造未来声音的创作者与艺人。",
    
      featuredMusicTitle: "音乐",
      featuredMusicText:
        "探索音乐作品与全新的声音体验。",
    
      featuredProductionsTitle: "制作",
      featuredProductionsText:
        "提供创意制作、声音设计与全新表达形式的制作服务。",
    
      aboutTag: "关于 héReSonare",
      aboutTitle: "让声音成为共鸣之处。",
      aboutText1:
        "héReSonare 认为声音不仅仅是传播媒介，它是连接创造力、情感、技术与人类体验的桥梁。",
      aboutText2:
        "通过艺术表达与技术创新，我们探索人与人、品牌与社区之间产生共鸣的新方式。",
    
      aboutStoryTitle: "品牌故事",
      aboutStoryText:
        "héReSonare 源于“共鸣”的理念，探索声音、创造力与科技如何塑造有意义的体验。",
    
      aboutMissionTitle: "使命",
      aboutMissionText:
        "创造超越边界、能够引发共鸣的体验。",
    
      aboutVisionTitle: "愿景",
      aboutVisionText:
        "成为一个通过声音、情感与创新连接人们的全球创意品牌。",
    
      contactTag: "联系我们",
      contactTitle: "一起创造新的共鸣",
      contactText:
        "无论您是创作者、合作伙伴还是创新者，我们都期待与您交流。",
    
      footerSlogan: "超越边界的声音",
      footerCopyright:
        "© 2026 héReSonare. 保留所有权利。",
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

      <Products content={content} language={language} />

      <About content={content} language={language} />

      <Contact content={content} language={language} />

      <Footer content={content} language={language} />
    </main>
  );
}
