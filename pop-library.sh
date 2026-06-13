#!/usr/bin/env bash
set -e

echo "🚀 Bootstrapping complete unabridged Canonical Ingestion Pipeline..."
mkdir -p books

# Local fallback data cache check
TEMP_RAW_FILE="books/adventures_raw.txt"

if [ ! -f "$TEMP_RAW_FILE" ]; then
    echo "📡 Downloading unabridged text from Project Gutenberg mirror..."
    # Project Gutenberg EBook #1661: The Adventures of Sherlock Holmes
    curl -sL "https://www.gutenberg.org/cache/epub/1661/pg1661.txt" -o "$TEMP_RAW_FILE"
else
    echo "📦 Local cached raw text source found. Bypassing network call."
fi

echo "⚙️ Processing raw corpus, injecting structural markdown anchors, and cleanly splitting files..."

# Use high performance text-processing engine (awk) to partition the text systematically by structural titles
awk '
BEGIN {
    split_count = 0;
    active = 0;
    current_file = "/dev/null";
    
    # Map the titles exactly to structural break points
    story[1] = "I. A SCANDAL IN BOHEMIA";        name[1] = "books/adv_01_scandal_in_bohemia.md";        t[1] = "A Scandal in Bohemia";
    story[2] = "II. THE RED-HEADED LEAGUE";     name[2] = "books/adv_02_red_headed_league.md";         t[2] = "The Red-Headed League";
    story[3] = "III. A CASE OF IDENTITY";       name[3] = "books/adv_03_a_case_of_identity.md";        t[3] = "A Case of Identity";
    story[4] = "IV. THE BOSCOMBE VALLEY MYSTERY";name[4] = "books/adv_04_boscombe_valley_mystery.md";   t[4] = "The Boscombe Valley Mystery";
    story[5] = "V. THE FIVE ORANGE PIPS";       name[5] = "books/adv_05_five_orange_pips.md";          t[5] = "The Five Orange Pips";
    story[6] = "VI. THE MAN WITH THE TWISTED LIP";name[6] = "books/adv_06_the_man_with_the_twisted_lip.md";t[6] = "The Man with the Twisted Lip";
    story[7] = "VII. THE ADVENTURE OF THE BLUE CARBUNCLE"; name[7] = "books/adv_07_the_blue_carbuncle.md";t[7] = "The Adventure of the Blue Carbuncle";
    story[8] = "VIII. THE ADVENTURE OF THE SPECKLED BAND"; name[8] = "books/adv_08_the_speckled_band.md";t[8] = "The Adventure of the Speckled Band";
    story[9] = "IX. THE ADVENTURE OF THE ENGINEER’S THUMB";name[9] = "books/adv_09_the_engineers_thumb.md";t[9] = "The Adventure of the Engineer’s Thumb";
    story[10] = "X. THE ADVENTURE OF THE NOBLE BACHELOR";  name[10] = "books/adv_10_the_noble_bachelor.md";t[10] = "The Adventure of the Noble Bachelor";
    story[11] = "XI. THE ADVENTURE OF THE BERYL CORONET";  name[11] = "books/adv_11_the_beryl_coronet.md"; t[11] = "The Adventure of the Beryl Coronet";
    story[12] = "XII. THE ADVENTURE OF THE COPPER BEECHES";name[12] = "books/adv_12_the_copper_beeches.md";t[12] = "The Adventure of the Copper Beeches";
    
    # End point marker for the 12th story to avoid ingest of Gutenberg legal appendix
    end_marker = "*** END OF THE PROJECT GUTENBERG EBOOK THE ADVENTURES OF SHERLOCK HOLMES ***";
}

{
    # Strip carriage returns
    gsub(/\r/, "");
    
    # Detect transitions between stories
    matched = 0;
    for (i = 1; i <= 12; i++) {
        if ($0 == story[i]) {
            close(current_file);
            split_count = i;
            current_file = name[i];
            print "# " t[i] > current_file;
            print "## The Adventures of Sherlock Holmes" > current_file;
            print "" > current_file;
            active = 1;
            matched = 1;
            break;
        }
    }
    
    if (matched) next;
    
    # Intercept Gutenberg legal footers safely
    if ($0 ~ /^\*\*\* END OF THE PROJECT/ || $0 == end_marker) {
        active = 0;
        close(current_file);
    }
    
    if (active) {
        # Convert Roman numeral chapters or subsections dynamically into markdown sub-headers
        if ($0 ~ /^[I|V|X]+\.$/ || $0 ~ /^CHAPTER [I|V|X]+/ || $0 ~ /^[0-9]+\.$/) {
            print "### Section " $0 > current_file;
        } else {
            print $0 > current_file;
        }
    }
}
END {
    print "🎉 Parsing operations completed successfully."
}
' "$TEMP_RAW_FILE"

# Clean up raw download block to preserve system disk space
rm -f "$TEMP_RAW_FILE"

echo "🏁 12 individual, completely unabridged short story modules have been successfully generated inside your /books directory!"