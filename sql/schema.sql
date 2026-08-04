-- Bangla Dictionary schema.
-- Mirrors the SQLAlchemy models the FastAPI service used, so data loaded by the
-- scripts/ loaders is byte-for-byte compatible with what the old API served.

CREATE TABLE IF NOT EXISTS word_meaning (
    id        SERIAL PRIMARY KEY,
    "pageNo"  TEXT,
    words     TEXT NOT NULL,
    number    TEXT,
    spelling  TEXT,
    meaning   TEXT,
    pos       TEXT,
    ipa       TEXT,
    root_lang TEXT,
    type      TEXT,
    sentence  TEXT,
    source    TEXT
);

-- word_meaning_id mirrors the old model's column but carries no FK: nothing in the
-- read path joins on it, and enforcing it would make loader ordering fragile.
CREATE TABLE IF NOT EXISTS ipa (
    id              SERIAL PRIMARY KEY,
    words           TEXT NOT NULL,
    ipa             TEXT,
    word_meaning_id INTEGER
);

CREATE TABLE IF NOT EXISTS pouranik_utso (
    id          SERIAL PRIMARY KEY,
    word        TEXT NOT NULL,
    description TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS enriched_dictionary (
    id              SERIAL PRIMARY KEY,
    word            TEXT NOT NULL,
    pronunciation   TEXT,
    pos             TEXT,
    pos_full        TEXT,
    ipa             TEXT,
    root_lang       TEXT,
    topic_marker    TEXT,
    female_marker   TEXT,
    meaning         TEXT,
    example         TEXT,
    synonyms        TEXT,
    page_no         TEXT,
    source          TEXT,
    antonyms        TEXT,
    rhyme_words     TEXT,
    english         TEXT,
    pouranic_source TEXT
);

-- Equality / ORDER BY lookups.
CREATE INDEX IF NOT EXISTS idx_word_meaning_words        ON word_meaning (words);
CREATE INDEX IF NOT EXISTS idx_word_meaning_pos          ON word_meaning (pos);
CREATE INDEX IF NOT EXISTS idx_word_meaning_source       ON word_meaning (source);
CREATE INDEX IF NOT EXISTS idx_word_meaning_pageno       ON word_meaning ("pageNo");
CREATE INDEX IF NOT EXISTS idx_ipa_words                 ON ipa (words);
CREATE INDEX IF NOT EXISTS idx_pouranik_word             ON pouranik_utso (word);
CREATE INDEX IF NOT EXISTS idx_enriched_word             ON enriched_dictionary (word);
CREATE INDEX IF NOT EXISTS idx_enriched_source           ON enriched_dictionary (source);

-- Prefix scans (LIKE 'অ%') need text_pattern_ops: a default btree index built under a
-- non-C collation cannot serve LIKE, and every browse page issues exactly that query.
CREATE INDEX IF NOT EXISTS idx_word_meaning_words_prefix ON word_meaning (words text_pattern_ops);
CREATE INDEX IF NOT EXISTS idx_pouranik_word_prefix      ON pouranik_utso (word text_pattern_ops);
CREATE INDEX IF NOT EXISTS idx_enriched_word_prefix      ON enriched_dictionary (word text_pattern_ops);
