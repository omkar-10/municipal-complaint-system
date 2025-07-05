import { useNavigate } from "react-router";
import {
  ChevronRight,
  Search,
  Clock,
  MapPin,
  EyeOff,
  Users,
} from "lucide-react";
import NavbarHome from "../components/NavbarHome";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <NavbarHome />

      <div className="max-w-7xl mx-auto px-6 py-12 md:py-24">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Left Column - Logo with Tagline */}
          <div className="lg:w-2/5 flex flex-col items-center lg:items-start">
            <img
              src="https://play-lh.googleusercontent.com/x_TXE59qydJC4iR-u3BLlSoaWjJC65sjo7Kk8a_cwR2M-Pqq-p5hou-VF5CTvNl0BzoN"
              alt="Municipal Logo"
              className="h-48 w-48 object-contain mb-6"
            />
            <div className="text-center lg:text-left">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Municipal Services
              </h1>
              <p className="text-blue-600 font-medium text-lg">
                Citizen Engagement Portal
              </p>
            </div>
          </div>

          {/* Right Column - Content */}
          <div className="lg:w-3/5 space-y-8">
            {/* Headline Section */}
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                Report. Track. Resolve.
                <br />
                <span className="text-blue-600">Better City Together</span>
              </h2>
              <p className="text-lg text-gray-600 mt-4 max-w-2xl">
                Our platform connects you directly with municipal authorities to
                report and track civic issues in real-time. Together we can
                improve our community.
              </p>
            </div>

            {/* Updated Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-blue-100/50 p-4 rounded-lg text-center">
                <div className="text-blue-600 font-bold text-2xl mb-1">
                  1,500+
                </div>
                <div className="text-sm text-gray-600">Complaints Resolved</div>
              </div>
              <div className="bg-blue-100/50 p-4 rounded-lg text-center">
                <div className="text-blue-600 font-bold text-2xl mb-1">
                  &lt; 24h
                </div>
                <div className="text-sm text-gray-600">Avg. Response Time</div>
              </div>
              <div className="bg-blue-100/50 p-4 rounded-lg text-center">
                <div className="text-blue-600 font-bold text-2xl mb-1">95%</div>
                <div className="text-sm text-gray-600">
                  Citizen Satisfaction
                </div>
              </div>
              <div className="bg-blue-100/50 p-4 rounded-lg text-center">
                <div className="text-blue-600 font-bold text-2xl mb-1">
                  300+
                </div>
                <div className="text-sm text-gray-600">Active Users</div>
              </div>
            </div>

            {/* CTA Buttons with curved corners */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                onClick={() => navigate("/register")}
                className="btn btn-primary px-8 py-3 text-lg font-semibold gap-2 rounded-xl hover:scale-[1.02] transition-transform"
              >
                Report an Issue
                <ChevronRight className="w-5 h-5" />
              </button>
              <button
                onClick={() => navigate("/login")}
                className="btn btn-outline border-gray-300 px-8 py-3 text-lg font-medium rounded-xl hover:bg-gray-100 hover:text-gray-800 hover:border-gray-400"
              >
                Track Complaint Status
              </button>
            </div>
          </div>
        </div>

        {/* Feature Cards Section */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Quick Reporting */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
            <div className="flex items-start gap-4">
              <div className="bg-blue-100/50 p-3 rounded-full">
                <Search className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">
                  Quick Reporting
                </h3>
                <p className="text-sm text-gray-500">
                  Lodge complaints in just a few clicks—takes less than 2
                  minutes.
                </p>
              </div>
            </div>
          </div>

          {/* Card 2: Fast Response Time */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
            <div className="flex items-start gap-4">
              <div className="bg-blue-100/50 p-3 rounded-full">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">
                  Fast Response Time
                </h3>
                <p className="text-sm text-gray-500">
                  Get updates or action within 24 hours from your municipality.
                </p>
              </div>
            </div>
          </div>

          {/* Card 3: Live Complaint Tracking */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
            <div className="flex items-start gap-4">
              <div className="bg-blue-100/50 p-3 rounded-full">
                <MapPin className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">
                  Live Complaint Tracking
                </h3>
                <p className="text-sm text-gray-500">
                  Monitor your complaint status and assigned team in real time.
                </p>
              </div>
            </div>
          </div>

          {/* Card 4: Anonymous Complaints */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
            <div className="flex items-start gap-4">
              <div className="bg-blue-100/50 p-3 rounded-full">
                <EyeOff className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">
                  Anonymous Complaints
                </h3>
                <p className="text-sm text-gray-500">
                  Raise issues privately without revealing your identity.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
