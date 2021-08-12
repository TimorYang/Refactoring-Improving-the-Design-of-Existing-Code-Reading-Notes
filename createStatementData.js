export default function createStatementData(invoice, plays) {
    const result = {};
    result.customer = invoice.customer;
    result.performances = invoice.performances.map(enrichPerformance);
    result.totalAmount = totalAmount(result);
    result.totalVolumeCredits = totalVolumeCredits(result);
    return result;

    function enrichPerformance(aPerformance) {
        const calulator = createPerformanceCalculator(aPerformance, playFor(aPerformance));
        const result = Object.assign({}, aPerformance);
        result.play = calulator.play;
        result.amount = calulator.amount;
        result.volumeCredits = calulator.volumeCredits;
        return result;
    }

    function playFor(aPerformance) {
        return plays[aPerformance.playID]
    }

    function totalAmount(data) {
        return data.performances
            .reduce((total, p) => total + p.amount, 0);
    }

    function totalVolumeCredits(data) {
        return data.performances
            .reduce((total, p) => total + p.volumeCredits, 0);
    }
}

class PerformanceCalulator {
    constructor(aPerformance, aPlay) {
        this.performances = aPerformance;
        this.play = aPlay;
    }

    get amount() {
        throw new Error('subclass responsibility');
    }

    get volumeCredits() {
        return result += Math.max(this.performances.audience - 30, 0);
    }
}

class TragedyCalculator extends PerformanceCalulator {
    get amount() {
        let result = 40000;
        if (this.performances.audience > 30) {
            result += 1000 * (this.performances.audience - 30);
        }
        return result;
    }
}

class ComedyCalculator extends PerformanceCalulator {
    get amount() {
        let result = 30000;
        if (this.performances.audience > 20) {
            result += 10000 + 500 * (this.performances.audience - 20);
        }
        result += 300 * this.performances.audience;
        return result;
    }

    get volumeCredits() {
        return super.volumeCredits + Math.floor(this.performances.audience / 5);
    }
}

function createPerformanceCalculator(aPerformance, aPlay) {
    switch (aPlay.type) {
        case "tragedy": return new TragedyCalculator(aPerformance, aPlay);
        case "comedy": return new ComedyCalculator(aPerformance, aPlay);

        default:
            throw new Error('unkown type: ${aPlay.type}');
    }
}