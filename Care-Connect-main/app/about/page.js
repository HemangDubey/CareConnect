'use client';

import { Heart, Users, HandHeart, Globe, Sparkles } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 text-white py-16 px-6 sm:px-16">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-20 relative">
          <div className="absolute inset-0 flex items-center justify-center opacity-10">
            <Sparkles className="w-64 h-64" />
          </div>
          <h1 className="text-5xl sm:text-7xl font-bold mb-6 relative">
            About <span className="bg-gradient-to-r from-pink-400 to-purple-300 bg-clip-text text-transparent">CareConnect</span>
          </h1>
          <p className="text-xl text-purple-200 max-w-3xl mx-auto leading-relaxed">
            Bridging the gap between donors, volunteers, and care
            organizations to build a better and more compassionate world.
          </p>
        </div>

        {/* Mission Section */}
        <div className="max-w-5xl mx-auto mb-20 bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-10 border border-white/20">
          <h2 className="text-4xl font-bold text-center mb-6 bg-gradient-to-r from-pink-300 to-purple-200 bg-clip-text text-transparent">
            Our Mission
          </h2>
          <p className="text-purple-100 text-center text-lg leading-relaxed">
            At <strong className="text-pink-300">CareConnect</strong>, our mission is to make helping
            others simple, transparent, and impactful. We provide a digital
            platform that allows individuals and organizations to contribute
            towards the needs of orphanages and old-age homes — whether through
            donations, volunteering, or fulfilling listed requirements.
          </p>
        </div>

        {/* Vision & Goals */}
        <div className="max-w-6xl mx-auto mb-20 grid md:grid-cols-2 gap-6">
          <div className="bg-white/10 backdrop-blur-md p-8 rounded-3xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 border border-white/20 group">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-pink-500/20 rounded-xl group-hover:bg-pink-500/30 transition-colors">
                <Heart className="text-pink-300 w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-pink-200">
                Compassionate Giving
              </h3>
            </div>
            <p className="text-purple-200 leading-relaxed">
              We empower users to donate items directly to those in need,
              ensuring every contribution reaches its rightful destination.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-8 rounded-3xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 border border-white/20 group">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-purple-500/20 rounded-xl group-hover:bg-purple-500/30 transition-colors">
                <Users className="text-purple-300 w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-purple-200">
                Volunteer Network
              </h3>
            </div>
            <p className="text-purple-200 leading-relaxed">
              Volunteers play a vital role at CareConnect — from organizing drives
              to helping deliver items and spreading awareness.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-8 rounded-3xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 border border-white/20 group">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-indigo-500/20 rounded-xl group-hover:bg-indigo-500/30 transition-colors">
                <HandHeart className="text-indigo-300 w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-indigo-200">
                Transparent Collaboration
              </h3>
            </div>
            <p className="text-purple-200 leading-relaxed">
              Every donation and request is tracked transparently so users can
              see the real impact they create for communities.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-8 rounded-3xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 border border-white/20 group">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-blue-500/20 rounded-xl group-hover:bg-blue-500/30 transition-colors">
                <Globe className="text-blue-300 w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-blue-200">
                Expanding Reach
              </h3>
            </div>
            <p className="text-purple-200 leading-relaxed">
              Our vision is to connect more homes, NGOs, and donors across India
              and beyond, expanding our network of care and kindness.
            </p>
          </div>
        </div>

        {/* Team & Community Section */}
        <div className="max-w-5xl mx-auto text-center bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-lg rounded-3xl p-12 border border-white/20 shadow-2xl">
          <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-pink-300 to-purple-200 bg-clip-text text-transparent">
            Built by a Team that Cares
          </h2>
          <p className="text-purple-100 text-lg mb-8 leading-relaxed">
            CareConnect was created by a passionate team of developers and
            volunteers who believe technology can drive social change. Together,
            we aim to simplify how compassion and support are shared in society.
          </p>
          <div className="inline-block bg-white/10 backdrop-blur-md px-8 py-4 rounded-2xl border border-pink-300/30">
            <p className="text-pink-200 font-semibold text-xl italic">
              &quot;Small acts of kindness, when multiplied, can transform the world.&quot;
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}