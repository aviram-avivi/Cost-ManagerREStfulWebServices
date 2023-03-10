// Aviram Avivi 209042316
//Meni Banin 206058612

const {CostModel} = require("../models/cost-model");
const {cache} = require("./cache");



// function to get cost report
async function getReport(req, res) {

    // destructuring query parameters from the request
    const { year, month, userId } = req.query;

    // This creates a cache key based on the year, month, and user id
    const cacheKey  = year+month+userId;
    console.log(cacheKey)
    if(cache.has(cacheKey)){
        return res.json(cache.get(cacheKey))
    }

    // finding all costs that match provided year, month, and user id
    const costs = await CostModel.find({user_id: userId, year: year, month: month});

    const result = {
        food:[],
        health:[],
        housing:[],
        sport:[],
        education:[],
        transportation:[],
        other: []
    }

    for (const cost of costs) {
        // adding each cost to its respective category
        result[cost.category].push({
            day: cost.day,
            description: cost.description,
            sum: cost.sum
        })
    }

    // This caches the result
    cache.set(cacheKey,result)
    res.json(result)
}

module.exports.getReport = getReport;