const Donation = require("../models/donationModel");
const Beneficiary = require("../models/beneficiaryModel");

// Get total donations, beneficiaries, and donors
exports.getSummaryData = async (req, res, next) => {
    try {
        const totalDonations = await Donation.aggregate([
            { $match: { status: "Paid" } },
            { $group: { _id: null, totalAmount: { $sum: "$amount" } } },
        ]);

        const totalBeneficiaries = await Beneficiary.countDocuments();
        const distinctDonors = await Donation.distinct("email");
        const totalDonors = distinctDonors.length; 
       


        res.status(200).json({
            success: true,
            data: {
                totalDonations: totalDonations[0]?.totalAmount || 0,
                totalBeneficiaries,
                totalDonors,
            },
        });
    } catch (error) {
        next(error);
    }
};

// Get monthly donations for Bar Chart
exports.getMonthlyDonations = async (req, res, next) => {
    try {
        const monthlyDonations = await Donation.aggregate([
            { $match: { status: "Paid" } },
            {
                $group: {
                    _id: { $month: "$createdAt" },
                    totalAmount: { $sum: "$amount" },
                },
            },
            { $sort: { _id: 1 } },
        ]);

        const months = [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
        ];

        const formattedData = monthlyDonations.map((data) => ({
            month: months[data._id - 1],
            totalAmount: data.totalAmount,
        }));

        res.status(200).json({
            success: true,
            data: formattedData,
        });
    } catch (error) {
        next(error);
    }
};

// Get cumulative donations for Line Chart
exports.getCumulativeDonations = async (req, res, next) => {
    try {
        const donations = await Donation.find({ status: "Paid" }).sort("createdAt");

        let cumulativeAmount = 0;
        const formattedData = donations.map((donation) => {
            cumulativeAmount += donation.amount;
            return {
                date: donation.createdAt.toISOString().split("T")[0],
                cumulativeAmount,
            };
        });

        res.status(200).json({
            success: true,
            data: formattedData,
        });
    } catch (error) {
        next(error);
    }
};

// Get donation distribution for Pie Chart
exports.getDonationDistribution = async (req, res, next) => {
    try {
        const distribution = await Donation.aggregate([
            { $match: { status: "Paid" } },
            {
                $group: {
                    _id: "$beneficiary",
                    totalAmount: { $sum: "$amount" },
                },
            },
            {
                $lookup: {
                    from: "beneficiaries",
                    localField: "_id",
                    foreignField: "_id",
                    as: "beneficiary",
                }
            },
            { $unwind: "$beneficiary" },
        ]);

        const formattedData = distribution.map((data) => ({
            beneficiary: data.beneficiary.name,
            totalAmount: data.totalAmount,
        }));

        res.status(200).json({
            success: true,
            data: formattedData,
        });
    } catch (error) {
        next(error);
    }
};

// Get donors vs beneficiaries for Doughnut Chart
exports.getDonorBeneficiaryRatio = async (req, res, next) => {
    try {
        const totalDonors = await Donation.distinct("email").length;
        const totalBeneficiaries = await Beneficiary.countDocuments();

        res.status(200).json({
            success: true,
            data: {
                donors: totalDonors,
                beneficiaries: totalBeneficiaries,
            },
        });
    } catch (error) {
        next(error);
    }
};
