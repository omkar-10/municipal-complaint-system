import { Mail, MapPin, Phone, Clock, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router";
import NavbarHome from "../components/NavbarHome";

const Contact = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <button
          onClick={() => navigate(-1)}
          className="btn btn-ghost gap-2 text-blue-600 hover:text-blue-800 mb-4 sm:mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="hidden sm:inline">Back to Home</span>
          <span className="sm:hidden">Back</span>
        </button>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Header Section */}
          <div className="bg-blue-700 px-4 sm:px-6 py-4">
            <h1 className="text-xl sm:text-2xl font-bold text-white">
              Contact Municipal Complaint Center
            </h1>
            <p className="text-blue-100 mt-1 text-sm sm:text-base">
              Official channel to resolve civic issues reported by citizens
            </p>
          </div>

          {/* Contact Information Section */}
          <div className="p-4 sm:p-6 space-y-6 sm:space-y-8">
            <div className="flex items-start gap-3 sm:gap-4">
              <MapPin className="w-5 h-5 mt-1 text-blue-600 flex-shrink-0" />
              <div>
                <h2 className="font-semibold text-gray-800 text-sm sm:text-base">
                  Head Office
                </h2>
                <p className="text-gray-600 mt-1 text-sm sm:text-base">
                  Municipal Bhavan, Ward No. 3<br />
                  Mumbai City, 400001
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="flex items-start gap-3 sm:gap-4">
                <Mail className="w-5 h-5 mt-1 text-blue-600 flex-shrink-0" />
                <div>
                  <h2 className="font-semibold text-gray-800 text-sm sm:text-base">
                    General Queries
                  </h2>
                  <p className="text-gray-600 mt-1 text-sm sm:text-base">
                    support@municipalconnect.gov.in
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 sm:gap-4">
                <Mail className="w-5 h-5 mt-1 text-blue-600 flex-shrink-0" />
                <div>
                  <h2 className="font-semibold text-gray-800 text-sm sm:text-base">
                    Complaint Assistance
                  </h2>
                  <p className="text-gray-600 mt-1 text-sm sm:text-base">
                    helpdesk@municipalconnect.gov.in
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 sm:gap-4">
                <Phone className="w-5 h-5 mt-1 text-blue-600 flex-shrink-0" />
                <div>
                  <h2 className="font-semibold text-gray-800 text-sm sm:text-base">
                    24/7 Citizen Helpline
                  </h2>
                  <p className="text-gray-600 mt-1 text-sm sm:text-base">
                    1800-202-5566
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 sm:gap-4">
                <Phone className="w-5 h-5 mt-1 text-blue-600 flex-shrink-0" />
                <div>
                  <h2 className="font-semibold text-gray-800 text-sm sm:text-base">
                    Emergency Services
                  </h2>
                  <p className="text-gray-600 mt-1 text-sm sm:text-base">
                    Dial 112 (Govt. Emergency Helpline)
                  </p>
                </div>
              </div>
            </div>

            {/* Office Hours Section */}
            <div>
              <h2 className="font-semibold text-gray-800 mb-3 flex items-center gap-2 text-sm sm:text-base">
                <Clock className="w-5 h-5 text-blue-600" />
                Office Hours
              </h2>
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left min-w-[300px]">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 sm:px-4 py-2 font-medium text-gray-700 text-sm sm:text-base">
                          Day
                        </th>
                        <th className="px-3 sm:px-4 py-2 font-medium text-gray-700 text-sm sm:text-base">
                          Timing
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-t border-gray-200">
                        <td className="px-3 sm:px-4 py-2 sm:py-3 text-gray-600 text-sm sm:text-base">
                          Mon – Fri
                        </td>
                        <td className="px-3 sm:px-4 py-2 sm:py-3 text-gray-600 text-sm sm:text-base">
                          9:00 AM – 6:00 PM
                        </td>
                      </tr>
                      <tr className="border-t border-gray-200">
                        <td className="px-3 sm:px-4 py-2 sm:py-3 text-gray-600 text-sm sm:text-base">
                          Saturday
                        </td>
                        <td className="px-3 sm:px-4 py-2 sm:py-3 text-gray-600 text-sm sm:text-base">
                          9:00 AM – 2:00 PM
                        </td>
                      </tr>
                      <tr className="border-t border-gray-200">
                        <td className="px-3 sm:px-4 py-2 sm:py-3 text-gray-600 text-sm sm:text-base">
                          Sunday
                        </td>
                        <td className="px-3 sm:px-4 py-2 sm:py-3 text-gray-600 text-sm sm:text-base">
                          Closed
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
