import { useState } from 'react';
import { Button } from '@heroui/button';
import { Card, CardBody, CardHeader } from '@heroui/card';
import { TrendingUp, Shield, Users, Zap, ArrowRight, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import Layout from '../components/Layout';

const HomePage = () => {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const features = [
    {
      icon: <Users className="w-8 h-8" />,
      title: "Exclusive Network",
      description: "Connect with verified crypto funds and accredited investors in a secure environment.",
      gradient: "from-blue-500 to-purple-600"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Verified Funds",
      description: "All funds undergo rigorous verification to ensure legitimacy and compliance.",
      gradient: "from-purple-500 to-pink-600"
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Performance Tracking",
      description: "Access detailed fund performance metrics and investment strategies.",
      gradient: "from-pink-500 to-red-600"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Fast Matching",
      description: "Efficient matching algorithm to connect the right investors with suitable funds.",
      gradient: "from-red-500 to-orange-600"
    }
  ];

  const stats = [
    { number: "500+", label: "Verified Funds" },
    { number: "$2.5B+", label: "Assets Under Management" },
    { number: "1000+", label: "Active Investors" },
    { number: "50+", label: "Countries" }
  ];

  const benefits = {
    LP: [
      "Access to exclusive crypto fund opportunities",
      "Detailed fund performance analytics",
      "Risk assessment and diversification tools",
      "Direct communication with fund managers"
    ],
    FUND: [
      "Connect with qualified investors",
      "Showcase your track record",
      "Streamlined investor onboarding",
      "Compliance and verification support"
    ]
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50"></div>
        {/* <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%239C92AC" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="4"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40"></div> */}
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-8">
            <h1 className="text-5xl md:text-7xl font-bold">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Connect
              </span>
              <br />
              <span className="text-gray-900">Crypto Capital</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              The premier platform connecting <span className="font-semibold text-purple-600">Limited Partners</span>, 
              <span className="font-semibold text-blue-600"> Family Offices</span>, and 
              <span className="font-semibold text-pink-600"> HNWIs</span> with top-tier crypto funds.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-12">
              <Link href="/signup">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold px-8 py-6 text-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                  endContent={<ArrowRight className="w-5 h-5" />}
                >
                  Get Started Today
                </Button>
              </Link>
              
              <Link href="/browse-funds">
                <Button
                  variant="bordered"
                  size="lg"
                  className="border-2 border-purple-200 text-purple-700 hover:bg-purple-50 font-semibold px-8 py-6 text-lg transition-all duration-300"
                >
                  Explore Funds
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Why Choose <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Open Allocators Network</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform provides the tools and network you need to succeed in the crypto investment space.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className={`p-6 hover:shadow-2xl transition-all duration-500 transform hover:scale-105 border-0 ${
                  hoveredCard === index ? 'shadow-2xl scale-105' : ''
                }`}
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <CardBody className="space-y-4">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center text-white mb-4`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Built for <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Everyone</span>
            </h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* For Limited Partners */}
            <Card className="p-8 border-2 border-blue-100 hover:border-blue-200 transition-colors">
              <CardHeader className="pb-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">For Limited Partners</h3>
                </div>
              </CardHeader>
              <CardBody>
                <ul className="space-y-4">
                  {benefits.LP.map((benefit, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{benefit}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/signup?role=LP">
                  <Button 
                    className="w-full mt-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white"
                    size="lg"
                  >
                    Join as LP
                  </Button>
                </Link>
              </CardBody>
            </Card>

            {/* For Funds */}
            <Card className="p-8 border-2 border-purple-100 hover:border-purple-200 transition-colors">
              <CardHeader className="pb-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">For Funds</h3>
                </div>
              </CardHeader>
              <CardBody>
                <ul className="space-y-4">
                  {benefits.FUND.map((benefit, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-purple-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{benefit}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/signup?role=FUND">
                  <Button 
                    className="w-full mt-6 bg-gradient-to-r from-purple-500 to-purple-600 text-white"
                    size="lg"
                  >
                    Join as Fund
                  </Button>
                </Link>
              </CardBody>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of investors and funds already using Open Allocators Network to build successful partnerships.
          </p>
          <Link href="/signup">
            <Button
              size="lg"
              className="bg-white text-purple-600 font-semibold px-8 py-6 text-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
              endContent={<ArrowRight className="w-5 h-5" />}
            >
              Start Your Journey
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default HomePage;


// import { Link } from "@heroui/link";
// import { Snippet } from "@heroui/snippet";
// import { Code } from "@heroui/code";
// import { button as buttonStyles } from "@heroui/theme";

// import { siteConfig } from "@/config/site";
// import { title, subtitle } from "@/components/primitives";
// import { GithubIcon } from "@/components/icons";
// import DefaultLayout from "@/layouts/default";

// export default function IndexPage() {
//   return (
//     <DefaultLayout>
//       <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
//         <div className="inline-block max-w-xl text-center justify-center">
//           <span className={title()}>Make&nbsp;</span>
//           <span className={title({ color: "violet" })}>beautiful&nbsp;</span>
//           <br />
//           <span className={title()}>
//             websites regardless of your design experience.
//           </span>
//           <div className={subtitle({ class: "mt-4" })}>
//             Beautiful, fast and modern React UI library.
//           </div>
//         </div>

//         <div className="flex gap-3">
//           <Link
//             isExternal
//             className={buttonStyles({
//               color: "primary",
//               radius: "full",
//               variant: "shadow",
//             })}
//             href={siteConfig.links.docs}
//           >
//             Documentation
//           </Link>
//           <Link
//             isExternal
//             className={buttonStyles({ variant: "bordered", radius: "full" })}
//             href={siteConfig.links.github}
//           >
//             <GithubIcon size={20} />
//             GitHub
//           </Link>
//         </div>

//         <div className="mt-8">
//           <Snippet hideCopyButton hideSymbol variant="bordered">
//             <span>
//               Get started by editing{" "}
//               <Code color="primary">pages/index.tsx</Code>
//             </span>
//           </Snippet>
//         </div>
//       </section>
//     </DefaultLayout>
//   );
// }
