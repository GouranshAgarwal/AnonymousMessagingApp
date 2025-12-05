import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Lock, Shield, Star, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-indigo-900 text-white">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="flex max-[1000px]:flex-col flex-row items-center justify-between gap-12 mb-24">
          <div className="max-[1040px]:w-[80%] space-y-6">
            <div className="inline-block px-4 py-2 rounded-full bg-purple-500/20 text-purple-300 font-medium text-sm mb-2">
              Share Anonymously. Connect Genuinely.
            </div>
            <h1 className="text-5xl md:text-6xl font-bold leading-tight">
              Anonymous <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-purple-400">Messages</span> That Matter
            </h1>
            <p className="text-xl text-indigo-200 leading-relaxed">
              Express your thoughts freely without revealing your identity. Create real connections through authentic communication.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Link href="/sign-up" >
              <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-full px-8 py-6 text-lg font-medium shadow-lg shadow-purple-500/25 transition-all hover:shadow-xl hover:shadow-purple-500/30">
                Get Started
              </Button></Link>
              <Link href={"/sign-in"}><Button variant="outline" className="border-2 border-purple-400/30 text-white bg-white/5 backdrop-blur-sm hover:bg-white/10 rounded-full px-8 py-6 text-lg transition-all">
                Log In
              </Button></Link>
            </div>
          </div>
          
          <div className="max-[1040px]: w-3/4 min-w-[650px] max-[600px]:hidden">
            {/* Floating messages in a more modern design */}
            <div className="relative h-96">
              <div className="absolute left-0 top-0 transform -rotate-6 animate-pulse">
                <Card className="w-64 bg-gradient-to-br from-indigo-800/90 to-purple-800/90 border-0 shadow-xl backdrop-blur-sm rounded-2xl">
                  <CardContent className="p-5">
                    <div className="flex items-center mb-3">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center">
                        <Star className="h-4 w-4 text-white" />
                      </div>
                      <div className="ml-3">
                        <p className="text-indigo-200 text-xs">Just now</p>
                        <p className="text-white text-sm font-medium">Anonymous</p>
                      </div>
                    </div>
                    <p className="text-white">"Your art inspires me more than you'll ever know. Keep creating, the world needs your vision."</p>
                  </CardContent>
                </Card>
              </div>
              
              <div className="absolute right-4 bottom-10 transform rotate-3 animate-pulse" style={{ animationDelay: '2s' }}>
                <Card className="w-64 bg-gradient-to-br from-purple-800/90 to-indigo-800/90 border-0 shadow-xl backdrop-blur-sm rounded-2xl">
                  <CardContent className="p-5">
                    <div className="flex items-center mb-3">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-400 flex items-center justify-center">
                        <Star className="h-4 w-4 text-white" />
                      </div>
                      <div className="ml-3">
                        <p className="text-indigo-200 text-xs">3 minutes ago</p>
                        <p className="text-white text-sm font-medium">Anonymous</p>
                      </div>
                    </div>
                    <p className="text-white">"I've been wanting to tell you this for a while - your kindness changed my life. Thank you."</p>
                  </CardContent>
                </Card>
              </div>
              
              <div className="absolute right-35 transform rotate-4 animate-pulse" style={{ animationDelay: '1s' }}>
                <Card className="w-64 bg-gradient-to-br from-indigo-800/90 to-purple-800/90 border-0 shadow-xl backdrop-blur-sm rounded-2xl">
                  <CardContent className="p-5">
                    <div className="flex items-center mb-3">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center">
                        <Star className="h-4 w-4 text-white" />
                      </div>
                      <div className="ml-3">
                        <p className="text-indigo-200 text-xs">1 minutes ago</p>
                        <p className="text-white text-sm font-medium">Anonymous</p>
                      </div>
                    </div>
                    <p className="text-white">"What's the secret to you productivity."</p>
                  </CardContent>
                </Card>
              </div>

              <div className="absolute left-25 bottom-12 transform -rotate-3 animate-pulse" style={{ animationDelay: '2s' }}>
                <Card className="w-64 bg-gradient-to-br from-indigo-800/90 to-purple-800/90 border-0 shadow-xl backdrop-blur-sm rounded-2xl">
                  <CardContent className="p-5">
                    <div className="flex items-center mb-3">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center">
                        <Star className="h-4 w-4 text-white" />
                      </div>
                      <div className="ml-3">
                        <p className="text-indigo-200 text-xs">10 minutes ago</p>
                        <p className="text-white text-sm font-medium">Anonymous</p>
                      </div>
                    </div>
                    <p className="text-white">"That presentation you gave was brilliant. You have a gift for explaining complex ideas."</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
        
        {/* Features Section */}
        <div className="mb-24">
          <h2 className="text-3xl font-bold mb-12 text-center">Why People <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-purple-400">Love</span> Our Platform</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-white/5 hover:bg-white/10 backdrop-blur-sm border-0 shadow-lg rounded-2xl transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/10 hover:-translate-y-1">
              <CardContent className="p-8 flex flex-col items-center text-center">
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center mb-6 shadow-lg shadow-purple-500/20">
                  <Lock className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3">Complete Anonymity</h3>
                <p className="text-indigo-200">Your identity remains fully private. No personal information required or tracked.</p>
              </CardContent>
            </Card>
            
            <Card className="bg-white/5 hover:bg-white/10 backdrop-blur-sm border-0 shadow-lg rounded-2xl transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/10 hover:-translate-y-1">
              <CardContent className="p-8 flex flex-col items-center text-center">
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-400 flex items-center justify-center mb-6 shadow-lg shadow-purple-500/20">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3">End-to-End Encryption</h3>
                <p className="text-indigo-200">Military-grade encryption keeps your conversations completely secure and private.</p>
              </CardContent>
            </Card>
            
            <Card className="bg-white/5 hover:bg-white/10 backdrop-blur-sm border-0 shadow-lg rounded-2xl transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/10 hover:-translate-y-1">
              <CardContent className="p-8 flex flex-col items-center text-center">
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center mb-6 shadow-lg shadow-purple-500/20">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3">Authentic Connections</h3>
                <p className="text-indigo-200">Form meaningful relationships based on genuine thoughts and feelings.</p>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Social Proof */}
        <div className="mb-24 text-center">
          <h2 className="text-2xl font-medium mb-2 text-indigo-200">Trusted by over</h2>
          <p className="text-5xl font-bold mb-8">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-purple-400">2 million+</span> users worldwide
          </p>
          <div className="flex flex-wrap justify-center gap-8 opacity-70">
            <div className="h-8 w-24 bg-white rounded-md opacity-20"></div>
            <div className="h-8 w-24 bg-white rounded-md opacity-20"></div>
            <div className="h-8 w-24 bg-white rounded-md opacity-20"></div>
            <div className="h-8 w-24 bg-white rounded-md opacity-20"></div>
            <div className="h-8 w-24 bg-white rounded-md opacity-20"></div>
          </div>
        </div>
        
        {/* Call to Action */}
        <div className="relative overflow-hidden rounded-3xl">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-90"></div>
          <div className="absolute inset-0 mix-blend-overlay opacity-20"></div>
          <div className="relative p-12 md:p-16 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to express yourself freely?</h2>
            <p className="text-xl text-pink-100 mb-8 max-w-2xl mx-auto">Join thousands who have discovered the power of anonymous connection. Start sending messages that matter today.</p>
            <Link href={"/sign-up"} ><Button className="bg-white hover:bg-pink-100 text-purple-700 rounded-full px-10 py-6 text-lg font-medium shadow-2xl shadow-purple-800/30 inline-flex items-center transition-all">
              Get Started Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button></Link>
          </div>
        </div>
      </div>
    </div>
  );
}
