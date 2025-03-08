import React, { useState } from "react";
import axios from "axios";
import Apiendpoint from "../../shared/services/Apiendpoint";

const Trackorder = () => {
  const [trackingId, setTrackingId] = useState("");
  const [trackingData, setTrackingData] = useState(null);
  const [error, setError] = useState("");

  const fetchTrackingStatus = async () => {
    try {
      const response = await axios.get(
        `${Apiendpoint}/api/order/track/${trackingId}`
      );
      setTrackingData(response.data);
      setError("");
    } catch (err) {
      setTrackingData(null);
      setError("Tracking ID not found");
    }
  };

  const SectionHeader = ({ title }) => (
    <div className="bg-purple-700 text-white px-6 py-3 font-semibold text-lg">
      {title}
    </div>
  );

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status) => {
    const statusColors = {
      "Order Placed": "bg-blue-500",
      "Order Dispatched": "bg-yellow-500",
      "Out for Delivery": "bg-orange-600",
      "Delivered": "bg-green-500",
      default: "bg-purple-500",
    };
    return statusColors[status] || statusColors.default;
  };

  const isOrderTracking = trackingData && trackingData.orderId && !trackingData.cid;

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto p-4 mt-24">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Track Your Order</h2>
          <div className="flex gap-4 justify-center">
            <input
              type="text"
              placeholder="Enter Your Tracking ID"
              value={trackingId}
              onChange={(e) => setTrackingId(e.target.value)}
              className="px-4 py-3 border-2 border-purple-400 rounded-lg w-full sm:w-72 bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-600 outline-none transition-all duration-300"
            />
            <button
              type="submit"
              onClick={fetchTrackingStatus}
              className="px-8 py-3 bg-purple-700 text-white rounded-lg font-semibold hover:bg-purple-800 transition-all duration-300 shadow-md hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
              disabled={!trackingId.trim()}
            >
              Track
            </button>
          </div>
          {error && (
            <p className="text-red-500 mt-2 font-medium text-center">{error}</p>
          )}
        </div>

        {trackingData && (
          <div className="space-y-4">
            {/* Booking Details */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <SectionHeader title="Booking Details" />
              <div className="grid grid-cols-1 md:grid-cols-5 gap-6 p-6">
                <div>
                  <div className="text-gray-600 text-sm">Booking Date</div>
                  <div className="font-medium">
                    {isOrderTracking
                      ? trackingData.Bookingdate
                      : trackingData.orderId
                      ? trackingData.Bookingdate
                      : "N/A"}
                  </div>
                </div>
                <div>
                  <div className="text-gray-600 text-sm">From</div>
                  <div className="font-medium text-blue-600">{trackingData.From}</div>
                </div>
                <div>
                  <div className="text-gray-600 text-sm">To</div>
                  <div className="font-medium text-blue-600">{trackingData.To}</div>
                </div>
                <div>
                  <div className="text-gray-600 text-sm">Packages</div>
                  <div className="font-medium">{trackingData.Packages}</div>
                </div>
                <div>
                  <div className="text-gray-600 text-sm">Delivery Type</div>
                  <div className="font-medium">Office</div>
                </div>
              </div>
            </div>

            {/* Current Status */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <SectionHeader title="Current Status" />
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-6">
                <div>
                  <div className="text-gray-600 text-sm">
                    {isOrderTracking ? "Order Status" : "Consignee Status"}
                  </div>
                  <div className="mt-1">
                    <span
                      className={`px-3 py-1 ${getStatusColor(
                        trackingData.currentStatus
                      )} text-white rounded-md`}
                    >
                      {trackingData.currentStatus}
                    </span>
                  </div>
                </div>
                <div>
                  <div className="text-gray-600 text-sm">Last Updated</div>
                  <div className="font-medium">
                    {trackingData.statusHistory &&
                    trackingData.statusHistory.length > 0
                      ? formatDate(
                          trackingData.statusHistory[
                            trackingData.statusHistory.length - 1
                          ].timestamp
                        )
                      : "N/A"}
                  </div>
                </div>
              </div>
            </div>

            {/* Status History Timeline */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <SectionHeader
                title={isOrderTracking ? "Order Status Timeline" : "Consignee Status Timeline"}
              />
              <div className="p-6">
                <div className="space-y-6">
                  {trackingData.statusHistory &&
                    trackingData.statusHistory.map((status, index) => (
                      <div key={index} className="relative flex items-start">
                        {index !== trackingData.statusHistory.length - 1 && (
                          <div className="absolute top-6 left-3 h-full w-0.5 bg-gray-200"></div>
                        )}
                        <div
                          className={`${getStatusColor(
                            status.status
                          )} rounded-full w-6 h-6 flex items-center justify-center shrink-0 z-10`}
                        >
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                        <div className="ml-4 pb-6">
                          <div className="font-semibold text-lg">{status.status}</div>
                          <div className="text-sm text-gray-600">
                            {formatDate(status.timestamp)}
                          </div>
                          {status.location && (
                            <div className="text-sm text-gray-700 mt-1">
                              Location: {status.location}
                            </div>
                          )}
                          {status.notes && (
                            <div className="text-sm text-gray-600 mt-1">
                              {status.notes}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            {/* Consignee Tracking (only for orderId tracking) */}
            {isOrderTracking && Array.isArray(trackingData.consignees) && trackingData.consignees.length > 0 && (
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <SectionHeader title="Consignee Tracking Details" />
                <div className="p-6 space-y-8">
                  {trackingData.consignees.map((consignee, index) => (
                    <div key={index} className="border-b pb-4 last:border-b-0">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-4">
                        <div>
                          <div className="text-gray-600 text-sm">Consignee ID</div>
                          <div className="font-medium">{consignee.cid}</div>
                        </div>
                        <div>
                          <div className="text-gray-600 text-sm">Consignee Name</div>
                          <div className="font-medium">{consignee.Consigneename}</div>
                        </div>
                        <div>
                          <div className="text-gray-600 text-sm">To</div>
                          <div className="font-medium text-blue-600">{consignee.To}</div>
                        </div>
                        <div>
                          <div className="text-gray-600 text-sm">Current Status</div>
                          <span
                            className={`px-3 py-1 ${getStatusColor(
                              consignee.currentStatus
                            )} text-white rounded-md`}
                          >
                            {consignee.currentStatus}
                          </span>
                        </div>
                      </div>
                      <div className="space-y-6">
                        {consignee.statusHistory.map((status, idx) => (
                          <div key={idx} className="relative flex items-start">
                            {idx !== consignee.statusHistory.length - 1 && (
                              <div className="absolute top-6 left-3 h-full w-0.5 bg-gray-200"></div>
                            )}
                            <div
                              className={`${getStatusColor(
                                status.status
                              )} rounded-full w-6 h-6 flex items-center justify-center shrink-0 z-10`}
                            >
                              <div className="w-2 h-2 bg-white rounded-full"></div>
                            </div>
                            <div className="ml-4 pb-6">
                              <div className="font-semibold text-lg">{status.status}</div>
                              <div className="text-sm text-gray-600">
                                {formatDate(status.timestamp)}
                              </div>
                              {status.location && (
                                <div className="text-sm text-gray-700 mt-1">
                                  Location: {status.location}
                                </div>
                              )}
                              {status.notes && (
                                <div className="text-sm text-gray-600 mt-1">
                                  {status.notes}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Delivery Details */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <SectionHeader title="Delivery Details" />
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-6">
                <div>
                  <div className="text-gray-600 text-sm">Consignment At</div>
                  <div className="font-medium">
                    {isOrderTracking && trackingData.Consignment
                      ? trackingData.Consignment
                      : trackingData.consigneedistrict || "N/A"}
                  </div>
                </div>
                <div>
                  <div className="text-gray-600 text-sm">Reached Date</div>
                  <div className="font-medium">
                    {trackingData.statusHistory &&
                    trackingData.statusHistory.length > 0
                      ? formatDate(
                          trackingData.statusHistory[
                            trackingData.statusHistory.length - 1
                          ].timestamp
                        )
                      : "N/A"}
                  </div>
                </div>
                <div>
                  <div className="text-gray-600 text-sm">Delivery Status</div>
                  <div className="font-medium">{trackingData.currentStatus}</div>
                </div>
                <div>
                  <div className="text-gray-600 text-sm">Delivery Date</div>
                  <div className="font-medium">
                    {trackingData.statusHistory &&
                    trackingData.statusHistory.find((s) => s.status === "Delivered")
                      ? formatDate(
                          trackingData.statusHistory.find(
                            (s) => s.status === "Delivered"
                          ).timestamp
                        )
                      : "Pending"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Trackorder;