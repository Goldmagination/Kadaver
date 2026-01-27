
import { PrismaClient, WorkType, Language } from '../lib/generated/prisma/index.js'

const prisma = new PrismaClient()

async function main() {
    console.log('Seeding Novel: The Metamorphosis...')

    // 1. Find or create Kafka
    let author = await prisma.author.findUnique({
        where: { slug: 'franz-kafka' }
    })

    if (!author) {
        author = await prisma.author.create({
            data: {
                name: 'Franz Kafka',
                slug: 'franz-kafka',
                languages: [Language.de],
                bioDe: 'Franz Kafka war ein deutschsprachiger Schriftsteller. Seine Erzählungen sowie die Romane Der Process, Das Schloss und Der Verschollene zählen zur Weltliteratur.',
                bioEn: 'Franz Kafka was a German-speaking Bohemian novelist and short-story writer, widely regarded as one of the major figures of 20th-century literature.',
                birthYear: 1883,
                deathYear: 1924,
            }
        })
    }

    // 2. Create The Metamorphosis (Die Verwandlung)
    const novelSlug = 'die-verwandlung'

    // Clean up if exists
    try {
        const existing = await prisma.work.findUnique({ where: { slug: novelSlug } })
        if (existing) {
            await prisma.work.delete({ where: { slug: novelSlug } })
        }
    } catch (e) { }

    const novel = await prisma.work.create({
        data: {
            title: 'Die Verwandlung',
            slug: novelSlug,
            type: WorkType.NOVEL,
            language: Language.de,
            authorId: author.id,
            renderingConfig: {
                fontFamily: 'playfair',
                fontSize: 'lg',
                lineHeight: 'relaxed',
                dropCap: true,
                paragraphSpacing: 'relaxed'
            },
            published: true,
            publishedAt: new Date('1915-10-01'),
            excerpt: 'Als Gregor Samsa eines Morgens aus unruhigen Träumen erwachte, fand er sich in seinem Bett zu einem ungeheueren Ungeziefer verwandelt.',
            chapters: {
                create: [
                    {
                        order: 1,
                        title: 'Erstes Kapitel',
                        content: `Als Gregor Samsa eines Morgens aus unruhigen Träumen erwachte, fand er sich in seinem Bett zu einem ungeheueren Ungeziefer verwandelt. Er lag auf seinem panzerartig harten Rücken und sah, wenn er den Kopf ein wenig hob, seinen gewölbten, braunen, von bogenförmigen Versteifungen geteilten Bauch, auf dessen Höhe sich die Bettdecke, zum gänzlichen Niedergleiten bereit, kaum noch erhalten konnte. Seine vielen, im Vergleich zu seinem sonstigen Umfang kläglich dünnen Beine flimmerten ihm hilflos vor den Augen.
            
»Was ist mit mir geschehen?« dachte er. Es war kein Traum. Sein Zimmer, ein richtiges, nur etwas zu kleines Menschenzimmer, lag ruhig zwischen den vier wohlbekannten Wänden. Über dem Tisch, auf dem eine auseinandergepackte Musterkollektion von Tuchwaren ausgebreitet war - Samsa war Reisender -, hing das Bild, das er vor kurzem aus einer illustrierten Zeitschrift ausgeschnitten und in einem hübschen, vergoldeten Rahmen untergebracht hatte. Es stellte eine Dame dar, die, mit einem Pelzhut und einer Pelzboa versehen, aufrecht dasaß und einen schweren Pelzmuff, in dem ihr ganzer Unterarm verschwunden war, dem Beschauer entgegenhob.

Gregor ́s Blick richtete sich dann zum Fenster, und das trübe Wetter - man hörte Regentropfen auf das Fensterblech aufschlagen - machte ihn ganz melancholisch. »Wie wäre es, wenn ich noch ein wenig weiterschliefe und alle Narrheiten vergäße«, dachte er, aber das war gänzlich undurchführbar, denn er war gewöhnt, auf der rechten Seite zu schlafen, konnte sich aber in seinem gegenwärtigen Zustand nicht in diese Lage bringen. Mit welcher Kraft er sich auch auf die rechte Seite warf, immer wieder schaukelte er in die Rückenlage zurück. Er versuchte es wohl hundertmal, schloß die Augen, um die zappelnden Beine nicht sehen zu müssen, und ließ erst ab, als er in der Seite einen noch nie gefühlten, leichten, dumpfen Schmerz zu fühlen begann.`
                    },
                    {
                        order: 2,
                        title: 'Zweites Kapitel',
                        content: `Erst in der Abenddämmerung erwachte Gregor aus seinem schweren ohnmachtähnlichen Schlaf. Er wäre gewiß nicht viel später auch ohne Störung erwacht, denn er fühlte sich genügend ausgeruht und ausgeschlafen, doch schien es ihm, als sei er durch einen flüchtigen Schritt und ein vorsichtiges Schließen der Korridortür geweckt worden. Der Schein der elektrischen Straßenlampen lag bleich hier und da auf der Zimmerdecke und auf den höheren Teilen der Möbel, aber unten bei Gregor war es dunkel. Langsam schob er sich, noch ungeschickt mit seinen Fühlern tastend, die er erst jetzt schätzen lernte, zur Tür hin, um nachzusehen, was dort geschehen war. Seine linke Seite schien eine einzige lange, unangenehm spannende Narbe, und er mußte auf seinen zwei Reihen Beinen regelrecht hinken. Ein Beinchen war übrigens im Laufe der Vormittagsvorfälle schwer verletzt worden - es war fast ein Wunder, daß nur eines verletzt worden war - und schleppte sich leblos nach.
            
Erst bei der Tür merkte er, was ihn eigentlich dorthin gelockt hatte; es war der Geruch von etwas Eßbarem gewesen. Denn dort stand eine Napf mit süßer Milch, in der kleine Schnitten von Weißbrot schwammen. Fast hätte er vor Freude gelacht, denn er hatte noch größeren Hunger als am Morgen, und gleich tauchte er seinen Kopf fast bis über die Augen in die Milch hinein. Aber bald zog er ihn enttäuscht wieder zurück; nicht nur, daß ihm das Essen wegen seiner heiklen linken Seite Schwierigkeiten machte - und er konnte nur essen, wenn der ganze Körper schnaufend mitarbeitete -, so schmeckte ihm auch die Milch, die sonst sein Lieblingsgetränk war und die ihm gewiß deshalb die Schwester hereingestellt hatte, gar nicht, ja er wandte sich fast mit Widerwillen von dem Napf ab und kroch in die Mitte des Zimmers zurück.`
                    },
                    {
                        order: 3,
                        title: 'Drittes Kapitel',
                        content: `Die schwere Verwundung Gregors, an der er über einen Monat litt - der Apfel war, da ihn niemand zu entfernen wagte, als ein sichtbares Andenken im Fleische sitzengeblieben -, schien selbst dem Vater daran erinnert zu haben, daß Gregor trotz seiner gegenwärtigen traurigen und ekelhaften Gestalt ein Familienmitglied war, das man nicht wie einen Feind behandeln durfte, sondern dem gegenüber es das Gebot der Familienpflicht war, den Widerwillen hinunterzuschlucken und zu dulden, nichts als zu dulden.
            
Und wenn nun auch Gregor durch seine Wunde an Beweglichkeit wahrscheinlich für immer eingebüßt hatte und für das Durchqueren seines Zimmers wie ein alter Invalide minutenlang brauchte - an das Kriechen in der Höhe war nicht zu denken -, so bekam er für diese Verschlechterung seines Zustandes einen, wie ihm schien, vollständig genügenden Ersatz dadurch, daß immer gegen Abend die Wohnzimmertür, die er schon eine oder zwei Stunden vorher scharf zu beobachten pflegte, geöffnet wurde, so daß er, im Dunkel seines Zimmers liegend, vom Wohnzimmer aus unsichtbar, die ganze Familie beim beleuchteten Tische sehen und ihre Reden, nunmehr mit allgemeiner Erlaubnis, also ganz anders als früher, anhören durfte.`
                    }
                ]
            }
        }
    })

    console.log(`Created Novel: ${novel.title} (${novel.id})`)
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
