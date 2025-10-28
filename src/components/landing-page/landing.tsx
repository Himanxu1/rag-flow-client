import {
  ArrowRight,
  BarChart3,
  Code2,
  MessageSquare,
  Sparkles,
  Users,
  Zap,
} from "lucide-react";
import Link from "next/link";
import React from "react";
import { Button } from "../ui/button";

const Landing = () => {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden font-sans">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-border/10 bg-background/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold font-sans">ChatFlow</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a
              href="#features"
              className="text-sm text-muted-foreground hover:text-foreground transition font-sans"
            >
              Features
            </a>
            <a
              href="#pricing"
              className="text-sm text-muted-foreground hover:text-foreground transition font-sans"
            >
              Pricing
            </a>
            <a
              href="#"
              className="text-sm text-muted-foreground hover:text-foreground transition font-sans"
            >
              Docs
            </a>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Log in
              </Button>
            </Link>
            <Link href="/register">
              <Button size="sm" className="bg-primary hover:bg-primary/90">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card/50 border border-border/30 mb-6">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm text-muted-foreground font-sans">
                AI-Powered Chatbot Builder
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight font-sans">
              Build Intelligent <span className="gradient-text">Chatbots</span>{" "}
              in Minutes
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8 font-sans">
              No coding required. Create, train, and deploy AI chatbots that
              understand your business. Engage customers 24/7 with intelligent
              conversations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary/90 gap-2"
                >
                  Start Building Free <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Button size="lg" variant="outline">
                Watch Demo
              </Button>
            </div>
          </div>

          {/* Hero Image */}
          <div className="mt-16 relative">
            <div className="glass rounded-2xl p-8 glow-cyan">
              <div className="bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl h-96 flex items-center justify-center">
                <div className="text-center">
                  <MessageSquare className="w-16 h-16 text-primary/50 mx-auto mb-4" />
                  <p className="text-muted-foreground font-sans">
                    Interactive Chatbot Preview
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="py-20 px-4 sm:px-6 lg:px-8 border-t border-border/10"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 font-sans">
              Powerful Features
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-sans">
              Everything you need to build, train, and deploy intelligent
              chatbots
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Zap,
                title: "Lightning Fast",
                description:
                  "Deploy chatbots instantly with our optimized infrastructure",
              },
              {
                icon: BarChart3,
                title: "Advanced Analytics",
                description:
                  "Track conversations, user satisfaction, and performance metrics",
              },
              {
                icon: Users,
                title: "Multi-Channel",
                description: "Deploy on websites, WhatsApp, Telegram, and more",
              },
              {
                icon: Code2,
                title: "Easy Integration",
                description:
                  "Integrate with your existing tools and workflows seamlessly",
              },
              {
                icon: MessageSquare,
                title: "Natural Language",
                description:
                  "AI understands context and provides intelligent responses",
              },
              {
                icon: Sparkles,
                title: "AI Training",
                description:
                  "Train your chatbot with your own data and knowledge base",
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="glass rounded-xl p-6 glow-cyan hover:border-primary/50 transition group"
              >
                <feature.icon className="w-8 h-8 text-primary mb-4 group-hover:scale-110 transition" />
                <h3 className="text-lg font-semibold mb-2 font-sans">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm font-sans">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { label: "Active Users", value: "50K+" },
              { label: "Chatbots Created", value: "100K+" },
              { label: "Conversations Daily", value: "10M+" },
              { label: "Uptime", value: "99.9%" },
            ].map((stat, idx) => (
              <div key={idx} className="text-center">
                <div className="text-4xl font-bold gradient-text mb-2 font-sans">
                  {stat.value}
                </div>
                <p className="text-muted-foreground font-sans">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-border/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 font-sans">
            Ready to Build Your Chatbot?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 font-sans">
            Join thousands of businesses using ChatFlow to automate customer
            support and boost engagement
          </p>
          <Link href="/register">
            <Button size="lg" className="bg-primary hover:bg-primary/90 gap-2">
              Get Started Free <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/10 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <MessageSquare className="w-4 h-4 text-primary-foreground" />
                </div>
                <span className="font-bold font-sans">ChatFlow</span>
              </div>
              <p className="text-sm text-muted-foreground font-sans">
                Build intelligent chatbots in minutes
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 font-sans">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground font-sans">
                <li>
                  <a href="#" className="hover:text-foreground transition">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition">
                    Security
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 font-sans">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground font-sans">
                <li>
                  <a href="#" className="hover:text-foreground transition">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 font-sans">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground font-sans">
                <li>
                  <a href="#" className="hover:text-foreground transition">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition">
                    Terms
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition">
                    Cookies
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border/10 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground font-sans">
            <p>&copy; 2025 ChatFlow. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-foreground transition">
                Twitter
              </a>
              <a href="#" className="hover:text-foreground transition">
                GitHub
              </a>
              <a href="#" className="hover:text-foreground transition">
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
