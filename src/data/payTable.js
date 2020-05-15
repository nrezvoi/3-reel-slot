import s from './symbols'
import l from './lines'

export default [
    {
        id: 1,
        symbols: [s.cherry.id, s.cherry.id, s.cherry.id],
        line: l.top,
        strict: true,
        payout: 2000
    },
    {
        id: 2,
        symbols: [s.cherry.id, s.cherry.id, s.cherry.id],
        line: l.mid,
        strict: true,
        payout: 1000
    },
    {
        id: 3,
        symbols: [s.cherry.id, s.cherry.id, s.cherry.id],
        line: l.bot,
        strict: true,
        payout: 4000
    },
    {
        id: 4,
        symbols: [s.seven.id, s.seven.id, s.seven.id],
        line: l.any,
        strict: true,
        payout: 150
    },
    {
        id: 5,
        symbols: [s.seven.id, s.cherry.id],
        line: l.any,
        strict: false,
        payout: 75
    },
    {
        id: 6,
        symbols: [s.bar3.id, s.bar3.id, s.bar3.id],
        line: l.any,
        strict: true,
        payout: 50
    },
    {
        id: 7,
        symbols: [s.bar2.id, s.bar2.id, s.bar2.id],
        line: l.any,
        strict: true,
        payout: 20
    },
    {
        id: 8,
        symbols: [s.bar.id, s.bar.id, s.bar.id],
        line: l.any,
        strict: true,
        payout: 10
    },
    {
        id: 9,
        symbols: [s.bar.id, s.bar2.id, s.bar3.id],
        line: l.any,
        strict: false,
        payout: 5
    },

]