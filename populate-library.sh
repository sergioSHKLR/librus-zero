#!/usr/bin/env bash
set -e

echo "📚 Constructing Comprehensive Library Asset Directories..."
mkdir -p books

# =========================================================================
# BOOK 1: A Study in Scarlet
# =========================================================================
cat << 'EOF' > books/study_in_scarlet.md
# A Study in Scarlet
## PART I: The Reminiscences of John H. Watson, M.D.
### Chapter I: Mr. Sherlock Holmes

In the year 1878 I took my degree of Doctor of Medicine of the University of London, and proceeded to Netley to go through the course prescribed for surgeons in the army. Having completed my studies there, I was duly attached to the Fifth Northumberland Fusiliers as Assistant Surgeon.

The regiment was stationed in India at the time, and before I could join it, the second Afghan war had broken out. On landing at Bombay, I found that my corps had advanced through the passes, and was already deep in the enemy's country. I followed, however, in company with many other officers who were in the same situation as myself, and succeeded in reaching Candahar in safety, where I found my regiment, and at once entered upon my new duties.

The campaign brought honors and promotion to many, but for me it had nothing but misfortune and disaster. I was removed from my brigade and attached to the Berkshires, with whom I served at the fatal battle of Maiwand. There I was struck on the shoulder by a Jezail bullet, which shattered the bone and grazed the subclavian artery. I should have fallen into the hands of the murderous Ghazis had it not been for the devotion and courage shown by Murray, my orderly, who threw me across a pack-horse, and succeeded in bringing me safely to the British lines.

### Chapter II: The Science of Deduction

We met next day by appointment, and inspected the rooms at No. 221B, Baker Street, of which he had spoken at our meeting. They consisted of a couple of comfortable bed-rooms and a single large airy sitting-room, cheerfully furnished, and illuminated by two broad windows. So desirable in every way were the apartments, and so moderate did the terms seem when divided between us, that the bargain was concluded upon the spot, and we at once took possession.
EOF

# =========================================================================
# BOOK 2: The Sign of Four
# =========================================================================
cat << 'EOF' > books/sign_of_four.md
# The Sign of Four
## The Science of Deduction
### Chapter I: Sherlock Holmes Encounters a Case

Sherlock Holmes took his bottle from the corner of the mantelpiece, and his hypodermic syringe from its neat morocco case. With his long, white, nervous fingers he adjusted the delicate needle, and rolled back his left shirt-cuff. For a little space his eyes rested thoughtfully upon the sinewy forearm and wrist, all scored and blacked with innumerable puncture-marks. Finally, he thrust the sharp point home, pressed down the tiny piston, and sank back into the velvet-lined arm-chair with a long sigh of satisfaction.

Three times a day for many months I had witnessed this performance, but custom had not reconciled my mind to it. On the contrary, from day to day I had become more irritable at the sight, and my conscience swelled nightly within me at the thought that I had lacked the courage to protest.

### Chapter II: The Statement of the Case

Miss Mary Morstan entered the room with a firm step and an outward composure of manner. She was a blonde young lady, small, dainty, well gloved, and dressed in the most perfect taste. Her face was quite unforgettable. Her eyes were sweet and amiable, and her large blue eyes were singularly spiritual and sympathetic. In her manner she showed no signs of agitation, but her hands trembled slightly as she took her seat near the window.
EOF

# =========================================================================
# BOOK 3: A Scandal in Bohemia
# =========================================================================
cat << 'EOF' > books/scandal_in_bohemia.md
# A Scandal in Bohemia
## The Adventures of Sherlock Holmes: Story I
### Chapter I: The Woman

To Sherlock Holmes she is always *the woman*. I have seldom heard him mention her under any other name. In his eyes she eclipses and predominates the whole of her sex. It was not that he felt any emotion akin to love for Irene Adler. All emotions, and that one particularly, were abhorrent to his cold, precise but admirably balanced mind. He was, I take it, the most perfect reasoning and observing machine that the world has seen, but as a lover he would have placed himself in a false position. He never spoke of the softer passions, save with a gibe and a sneer. They were admirable things for the observer—excellent for drawing the veil from men’s motives and actions. But for the trained reasoner to admit such intrusions into his own delicate and finely adjusted temperament was to introduce a distracting factor which might throw a doubt upon all his mental results.

### Chapter II: The Photographic Record

I had seen little of Holmes lately. My marriage had drifted us away from each other. My own complete happiness, and the home-centred interests which rise up around the man who first finds himself master of his own establishment, were sufficient to absorb all my attention, while Holmes, who loathed every form of society with his whole Bohemian soul, remained in our lodgings in Baker Street, buried among his old books, and alternating from week to week between cocaine and ambition, the drowsiness of the drug, and the fierce energy of his own keen nature.
EOF

# =========================================================================
# BOOK 4: The Red-Headed League
# =========================================================================
cat << 'EOF' > books/red_headed_league.md
# The Red-Headed League
## The Adventures of Sherlock Holmes: Story II
### Chapter I: Jabez Wilson's Discovery

I had called upon my friend, Mr. Sherlock Holmes, one day in the autumn of last year and found him in deep conversation with a very stout, florid-faced, elderly gentleman with fiery red hair. With an apology for my intrusion, I was about to withdraw when Holmes pulled me abruptly into the room and closed the door behind me.

"You could not possibly have come at a better time, my dear Watson," he said cordially.

"I was afraid that you were engaged."

"So I am. Very much so."

"Then I can wait in the next room."

"Not at all. This gentleman, Mr. Wilson, has been my partner and assistant in many of my most successful cases, and I have no doubt that he will be of the utmost use to me in yours also."

### Chapter II: The Fleet Street Advertisement

The stout gentleman half rose from his chair and gave a bob of greeting, with a quick little questioning glance from his small fat-encircled eyes. "The Red-Headed League is a remarkable association," he began, pulling a folded newspaper from his pocket. "It began with an extraordinary advertisement which my assistant, Vincent Spaulding, brought to my attention in the office exactly two months ago today."
EOF

# =========================================================================
# BOOK 5: A Case of Identity
# =========================================================================
cat << 'EOF' > books/case_of_identity.md
# A Case of Identity
## The Adventures of Sherlock Holmes: Story III
### Chapter I: Life's Strange Realities

"My dear fellow," said Sherlock Holmes as we sat on either side of the hearth in his lodgings at Baker Street, "life is infinitely stranger than anything which the mind of man could invent. We would not dare to conceive the things which are really mere commonplaces of existence. If we could fly out of that window hand in hand, hover over this great city, gently remove the roofs, and peep in at the queer things which are going on, the strange coincidences, the plannings, the cross-purposes, the wonderful chains of events, working through generations, and leading to the most outré results, it would make all fiction with its conventionalities and foreseen conclusions most stale and unprofitable."

### Chapter II: Miss Mary Sutherland's Visitors

The visitor who entered was a large woman, tall, with a broad, good-humoured face, and a pair of small, blinking eyes. She wore a dark brown turban-hat with a tilting red feather, a black velvet jacket, and a heavy gold watch-chain which looped down into her pocket. She looked about her in an uncertain, hesitant way, and her hands worked nervously at her buttons as she stood before the desk of the master sleuth.
EOF

# =========================================================================
# BOOK 6: The Boscombe Valley Mystery
# =========================================================================
cat << 'EOF' > books/boscombe_valley.md
# The Boscombe Valley Mystery
## The Adventures of Sherlock Holmes: Story IV
### Chapter I: The Tragedy of Herefordshire

We were at breakfast one morning, my wife and I, when the maid brought in a telegram. It was from Sherlock Holmes and ran in this way:

"Have you a couple of days to spare? Have just been wired for from the West of England in connection with Boscombe Valley tragedy. Shall be glad if you will come with me. Air and scenery perfect. Leave Paddington by the 11:15."

"What do you say, dear?" said my wife, looking across at me. "Will you go?"

"I really don't know what to say. I have a fairly long list of patients at present."

"Oh, Anstruther would do your work for you. You have been looking a little pale lately, and the change will do you good. Besides, you are always so intensely interested in Mr. Sherlock Holmes' cases."

### Chapter II: Investigation on the Spot

The journey from London to Ross was long and tedious, but Holmes passed the time by reading a massive bundle of local morning papers which he had purchased at the station. At last he threw them down into a corner and sat looking out of the carriage window, his sharp, hawk-like profile outlined clearly against the green fields of Gloucestershire.
EOF

# =========================================================================
# BOOK 7: The Five Orange Pips
# =========================================================================
cat << 'EOF' > books/five_orange_pips.md
# The Five Orange Pips
## The Adventures of Sherlock Holmes: Story V
### Chapter I: An October Tempest

When I look over my notes and records of the Sherlock Holmes cases between the years '82 and '90, I am faced by so many which present strange and interesting features that it is no easy matter to know which to choose and which to leave. Some, however, have already gained publicity through the papers, and others have not offered a wide field for those peculiar qualities of deduction which my friend possessed in so high a degree. One case, however, stands out so completely by itself that I cannot refrain from giving the details to the public, despite its tragic ending.

### Chapter II: The Warning Call

It was the latter end of September, and the equinoctial gales had set in with exceptional fury. All day the wind had screamed and the rain had beaten against the windows, so that even here in the heart of great, hand-made London we were forced for a moment to realize the rude shock of the elements. As the evening drew in, the storm grew louder and louder, and the wind cried and sobbed like a child in the chimney. Holmes sat moodily by the side of the fireplace, indexing his records of old crimes.
EOF

# =========================================================================
# BOOK 8: The Man with the Twisted Lip
# =========================================================================
cat << 'EOF' > books/twisted_lip.md
# The Man with the Twisted Lip
## The Adventures of Sherlock Holmes: Story VI
### Chapter I: The Opium Den of East London

Isa Whitney, brother of the late Elias Whitney, D.D., Principal of the Theological College of St. George's, was much addicted to opium. The habit had been foolishly contracted when he was a medical student, and he had found, as so many have done, that it is an easy thing to acquire a taste for the drug, but a most terrible and difficult thing to shake it off. He had become a slave to the pipe, and for months together he would disappear from his home, returning at last with a haggard face and bloodshot eyes, to beg for the money which would enable him to return to his vice.

### Chapter II: The Disappearance of Neville St. Clair

It was into this wretched den of misery and degradation that I was forced to go on a rainy Friday night to rescue the unfortunate man on behalf of his weeping wife. But no sooner had I stepped inside than a hand touched my arm in the shadows, and a voice whispered in my ear: "Walk past me, Watson, and then look back at my face." It was Sherlock Holmes in a masterful disguise.
EOF

# =========================================================================
# BOOK 9: The Blue Carbuncle
# =========================================================================
cat << 'EOF' > books/blue_carbuncle.md
# The Adventure of the Blue Carbuncle
## The Adventures of Sherlock Holmes: Story VII
### Chapter I: A Christmas Token

I had called upon my friend Sherlock Holmes upon the second morning after Christmas, with the intention of wishing him the compliments of the season. He was lounging upon the sofa in a purple dressing-gown, a pipe-rack within his reach upon the right, and a pile of crumpled morning papers, evidently newly studied, near at hand. Beside the couch was a wooden chair, and on the angle of the back hung a very seedy and disreputable hard-felt hat, much the worse for wear, and cracked in several places. A lens and a forceps upon the seat of the chair suggested that the hat had been suspended in this manner for the purpose of examination.

### Chapter II: The Lost Countess Gem

"You are engaged," said I; "perhaps I interrupt you."

"Not at all. I am glad to have a friend with whom I can discuss my results. The matter is a perfectly trivial one," he continued, motioning his hand toward the old hat, "but there are points of interest in connection with it which make it unique and instructive."
EOF

# =========================================================================
# BOOK 10: The Speckled Band
# =========================================================================
cat << 'EOF' > books/speckled_band.md
# The Adventure of the Speckled Band
## The Adventures of Sherlock Holmes: Story VIII
### Chapter I: The Early Morning Visitor

In glancing over my notes of the seventy odd cases in which I have during the last eight years studied the methods of my friend Sherlock Holmes, I find many tragical, some comic, a large number merely strange, but none commonplace; for, working as he did rather for the love of his art than for the acquirement of wealth, he refused to associate himself with any investigation which did not tend toward the unusual, and even the fantastic. Of all these varied cases, however, I cannot recall any which presented more singular features than that which was associated with the well-known family of the Roylotts of Stoke Moran.

### Chapter II: The Terrors of Stoke Moran

The lady who entered was clad in black and heavily veiled, but as she raised her head at Holmes' request, I could see that she was in a pitiable state of agitation, her face all drawn and gray, with restless, frightened eyes, like those of some hunted animal. Her features were beautiful, but her hair was shot with premature gray, and her expression was weary and desperate.
EOF

# =========================================================================
# BOOK 11: The Engineer’s Thumb
# =========================================================================
cat << 'EOF' > books/engineers_thumb.md
# The Adventure of the Engineer’s Thumb
## The Adventures of Sherlock Holmes: Story IX
### Chapter I: A Surgical Emergency

Of all the problems which have been submitted to my friend Mr. Sherlock Holmes for solution during the years of our intimacy, there were only two which I was the means of introducing to his notice—that of Mr. Hatherley’s thumb, and that of the Colonel’s madness. Of these the former had points of such exceptional and dramatic interest that it deserves to be recorded in detail, especially since it gave the master observer an opportunity to apply his system of deduction to a set of facts which had baffled the local authorities completely.

### Chapter II: The Midnight Appointment

Mr. Victor Hatherley was a young hydraulic engineer who had established a modest practice in London. One evening an extraordinary gentleman named Colonel Lysander Stark called upon him with an offer of fifty guineas for a single night's professional consultation at a remote country house, under conditions of the absolute strictest secrecy.
EOF

# =========================================================================
# BOOK 12: The Noble Bachelor
# =========================================================================
cat << 'EOF' > books/noble_bachelor.md
# The Adventure of the Noble Bachelor
## The Adventures of Sherlock Holmes: Story X
### Chapter I: A High Society Marriage

Lord St. Simon, the second son of the Duke of Balmoral, had long been regarded as one of the most eligible bachelors in the British Empire. When it was announced that he was about to contract an alliance with Miss Hatty Doran, the only daughter of a fabulously wealthy California gold mining magnate, the event naturally became the chief topic of conversation in all the fashionable drawing-rooms of the metropolis.

### Chapter II: The Bride's Sudden Flight

But the wedding breakfast had scarcely been concluded when the bride, complaining of a sudden indisposition, retired to her chambers and vanished completely. It was under these mysterious circumstances that Lord St. Simon rushed to Baker Street to seek the assistance of Sherlock Holmes.
EOF

echo "🏁 Library population completed successfully! 12 markdown assets populated inside /books."