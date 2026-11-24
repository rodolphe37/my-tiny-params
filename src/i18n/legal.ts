import type { Lang } from './index'

/** Documents juridiques (mentions légales, CGU), en texte brut : les URLs y sont rendues cliquables par la page. */
export interface Section {
  title: string
  body: string[]
}
export interface LegalDoc {
  title: string
  updated: string
  sections: Section[]
}
export interface LegalDocs {
  legal: LegalDoc
  terms: LegalDoc
}

export const PUBLISHER = 'Rodolphe Augusto'
export const COPYRIGHT_FROM = 2026
export const REPO_URL = 'https://github.com/rodolphe37/my-tiny-params'
export const CONTACT_URL = `${REPO_URL}/issues`

export const legalDocs: Record<Lang, LegalDocs> = {
  fr: {
    legal: {
      title: 'Mentions légales',
      updated: '24 novembre 2026',
      sections: [
        {
          title: 'Éditeur du site',
          body: [
            `Le site MyTinyParams est édité à titre non professionnel par ${PUBLISHER}, personne physique (particulier).`,
            'Conformément à l’article 6, III, 2° de la loi n° 2004-575 du 21 juin 2004 pour la confiance dans l’économie numérique (LCEN), l’éditeur, non professionnel, a choisi de ne pas rendre publics son adresse postale et ses autres coordonnées personnelles. Elles ont été communiquées à l’hébergeur, qui peut les transmettre à l’autorité judiciaire sur réquisition.',
          ],
        },
        { title: 'Directeur de la publication', body: [PUBLISHER] },
        {
          title: 'Contact',
          body: [`Pour toute question, demande de retrait ou signalement : ${CONTACT_URL}`],
        },
        {
          title: 'Hébergeur',
          body: ['Netlify, Inc. — 512 2nd Street, Suite 200, San Francisco, CA 94107, États-Unis — https://www.netlify.com'],
        },
        {
          title: 'Propriété intellectuelle',
          body: [
            `© ${COPYRIGHT_FROM} ${PUBLISHER}. Le code source de l’application est publié sous licence MIT (voir le fichier LICENSE du dépôt : ${REPO_URL}).`,
            'Le nom MyTinyParams, le logo et l’icône ne sont pas couverts par cette licence et restent la propriété de l’éditeur : toute réutilisation pour désigner un autre produit ou service, sans autorisation écrite préalable, est interdite, hors usage normal du service et exceptions prévues par la loi.',
            'Les marques citées (Google Analytics, Google Tag Manager, Facebook, etc.) appartiennent à leurs propriétaires respectifs et ne sont mentionnées qu’à titre d’exemple de compatibilité.',
          ],
        },
        {
          title: 'Données personnelles et stockage local',
          body: [
            'MyTinyParams fonctionne entièrement dans votre navigateur : les URLs que vous saisissez ne sont ni envoyées, ni enregistrées sur un serveur. Il n’y a ni compte utilisateur, ni outil de mesure d’audience, ni cookie, ni publicité.',
            'L’application mémorise uniquement sur votre appareil (stockage local du navigateur) vos préférences : langue, thème, réglages de raccourcissement et alias, et la fermeture de l’invitation d’installation. Ces données purement techniques ne quittent jamais votre appareil et sont supprimées en vidant les données du site dans votre navigateur.',
            'Comme tout hébergeur, Netlify peut traiter des données techniques de connexion (adresse IP, date, pages demandées) pour assurer le fonctionnement et la sécurité du service. L’éditeur n’exploite pas ces journaux à d’autres fins. Voir la politique de confidentialité de Netlify : https://www.netlify.com/privacy/',
            'Conformément au RGPD et à la loi Informatique et Libertés, vous disposez de droits d’accès, de rectification et d’effacement de vos données ; en l’absence de collecte par l’éditeur, ils s’exercent surtout auprès de l’hébergeur. Vous pouvez aussi saisir la CNIL (https://www.cnil.fr).',
          ],
        },
        {
          title: 'Droit applicable',
          body: ['Le site est soumis au droit français. Sous réserve des règles impératives applicables aux consommateurs, les tribunaux français sont compétents.'],
        },
      ],
    },
    terms: {
      title: 'Conditions générales d’utilisation',
      updated: '24 novembre 2026',
      sections: [
        {
          title: '1. Objet',
          body: [`Les présentes conditions générales d’utilisation (CGU) encadrent l’usage du service MyTinyParams, édité par ${PUBLISHER}. En utilisant le service, vous acceptez les CGU.`],
        },
        {
          title: '2. Description du service',
          body: [
            'MyTinyParams raccourcit les paramètres d’une URL (notamment les paramètres de campagne UTM) sans modifier le nom de domaine, en les regroupant dans un paramètre court et réversible. Un décodeur, à installer sur votre site, restaure les paramètres d’origine.',
            'Le traitement est effectué localement dans votre navigateur. Le service est fourni gratuitement, sans création de compte.',
          ],
        },
        {
          title: '3. Accès au service',
          body: ['Le service est accessible 24 h/24 sauf interruption, maintenance ou cas de force majeure. L’éditeur ne garantit ni sa disponibilité, ni son absence d’erreur, et peut le modifier ou l’interrompre à tout moment, sans préavis.'],
        },
        {
          title: '4. Usage autorisé',
          body: [
            'Vous vous engagez à utiliser le service de façon licite. Il est notamment interdit de l’utiliser pour dissimuler ou rendre trompeur un lien malveillant (hameçonnage, fraude, logiciel malveillant, spam), pour porter atteinte aux droits de tiers, ou pour perturber le fonctionnement du service.',
          ],
        },
        {
          title: '5. Vos responsabilités',
          body: [
            'Vous êtes seul responsable des liens que vous créez et diffusez, ainsi que de leur intégration sur vos sites. Avant toute campagne, testez le décodeur et vérifiez que vos outils de mesure reçoivent bien les paramètres attendus : sans décodeur installé et exécuté avant vos outils de suivi, les campagnes ne sont pas attribuées.',
            'Vous restez responsable du respect de la réglementation applicable à votre suivi (consentement, information des visiteurs, RGPD, ePrivacy).',
          ],
        },
        {
          title: '6. Responsabilité de l’éditeur',
          body: [
            'Le service est fourni « en l’état », sans garantie d’aucune sorte. Dans les limites autorisées par la loi, l’éditeur n’est pas responsable des dommages indirects, notamment la perte de données de mesure, de chiffre d’affaires ou d’opportunités liée à l’usage du service ou à une erreur d’intégration.',
            'Rien dans les présentes CGU n’exclut la responsabilité de l’éditeur en cas de dol ou de faute lourde, ni les droits que la loi reconnaît impérativement aux consommateurs.',
          ],
        },
        {
          title: '7. Propriété intellectuelle',
          body: [
            `Le code source de l’application est publié sous licence MIT ; le nom, le logo et l’icône restent la propriété de ${PUBLISHER} (voir les mentions légales). L’éditeur vous concède un droit personnel, non exclusif et non transférable d’utiliser le service.`,
            'Les URLs que vous créez avec le service vous appartiennent.',
          ],
        },
        {
          title: '8. Données personnelles',
          body: ['Le service ne collecte aucune donnée personnelle. Le détail du stockage local et de l’hébergement figure dans les mentions légales.'],
        },
        {
          title: '9. Modification des CGU',
          body: ['L’éditeur peut modifier les CGU à tout moment. La version en vigueur est celle publiée sur cette page, avec sa date de mise à jour. Continuer à utiliser le service après modification vaut acceptation.'],
        },
        {
          title: '10. Droit applicable et litiges',
          body: [
            'Les CGU sont soumises au droit français. En cas de litige, une solution amiable sera recherchée en priorité (contact : voir les mentions légales). À défaut, et sous réserve des règles impératives applicables aux consommateurs, les tribunaux français sont compétents.',
          ],
        },
      ],
    },
  },
  en: {
    legal: {
      title: 'Legal notice',
      updated: 'November 24, 2026',
      sections: [
        {
          title: 'Publisher',
          body: [
            `The MyTinyParams website is published on a non-professional basis by ${PUBLISHER}, a private individual.`,
            'In accordance with Article 6, III, 2° of French law no. 2004-575 of 21 June 2004 (LCEN), the publisher, as a non-professional, has chosen not to make their postal address and other personal contact details public. They have been provided to the hosting provider, who may disclose them to the judicial authorities upon request.',
          ],
        },
        { title: 'Publication director', body: [PUBLISHER] },
        {
          title: 'Contact',
          body: [`For any question, removal request or report: ${CONTACT_URL}`],
        },
        {
          title: 'Hosting provider',
          body: ['Netlify, Inc. — 512 2nd Street, Suite 200, San Francisco, CA 94107, USA — https://www.netlify.com'],
        },
        {
          title: 'Intellectual property',
          body: [
            `© ${COPYRIGHT_FROM} ${PUBLISHER}. The application’s source code is published under the MIT license (see the LICENSE file in the repository: ${REPO_URL}).`,
            'The MyTinyParams name, logo and icon are not covered by that license and remain the publisher’s property: any reuse to designate another product or service, without prior written permission, is prohibited, apart from normal use of the service and exceptions provided by law.',
            'Third-party trademarks (Google Analytics, Google Tag Manager, Facebook, etc.) belong to their respective owners and are only mentioned as compatibility examples.',
          ],
        },
        {
          title: 'Personal data and local storage',
          body: [
            'MyTinyParams runs entirely in your browser: the URLs you enter are neither sent to nor stored on a server. There are no user accounts, no audience measurement tools, no cookies and no advertising.',
            'The application only remembers, on your device (browser local storage), your preferences: language, theme, shortening settings and aliases, and whether you dismissed the install prompt. This purely technical data never leaves your device and is erased by clearing the site data in your browser.',
            'Like any hosting provider, Netlify may process technical connection data (IP address, date, requested pages) to operate and secure the service. The publisher does not use these logs for any other purpose. See Netlify’s privacy policy: https://www.netlify.com/privacy/',
            'Under the GDPR and French data protection law, you have rights of access, rectification and erasure of your data; as the publisher collects none, they mostly apply to the hosting provider. You may also lodge a complaint with the CNIL (https://www.cnil.fr) or your local data protection authority.',
          ],
        },
        {
          title: 'Governing law',
          body: ['This website is governed by French law. Subject to mandatory consumer protection rules, French courts have jurisdiction.'],
        },
      ],
    },
    terms: {
      title: 'Terms of use',
      updated: 'November 24, 2026',
      sections: [
        {
          title: '1. Purpose',
          body: [`These terms of use govern the use of the MyTinyParams service, published by ${PUBLISHER}. By using the service, you accept these terms.`],
        },
        {
          title: '2. The service',
          body: [
            'MyTinyParams shortens the parameters of a URL (notably UTM campaign parameters) without changing the domain name, by packing them into a short, reversible parameter. A decoder, to be installed on your website, restores the original parameters.',
            'Processing is performed locally in your browser. The service is provided free of charge, without creating an account.',
          ],
        },
        {
          title: '3. Access',
          body: ['The service is available 24/7 except for interruptions, maintenance or force majeure. The publisher does not guarantee its availability or that it is error-free, and may change or discontinue it at any time without notice.'],
        },
        {
          title: '4. Permitted use',
          body: [
            'You agree to use the service lawfully. In particular, you must not use it to hide or disguise a malicious link (phishing, fraud, malware, spam), to infringe third-party rights, or to disrupt the service.',
          ],
        },
        {
          title: '5. Your responsibilities',
          body: [
            'You are solely responsible for the links you create and share, and for integrating them on your sites. Before any campaign, test the decoder and check that your measurement tools receive the expected parameters: without the decoder installed and running before your tracking tools, campaigns are not attributed.',
            'You remain responsible for complying with the regulations that apply to your tracking (consent, visitor information, GDPR, ePrivacy).',
          ],
        },
        {
          title: '6. Publisher’s liability',
          body: [
            'The service is provided “as is”, without warranty of any kind. To the extent permitted by law, the publisher is not liable for indirect damages, including loss of measurement data, revenue or opportunities arising from the use of the service or an integration error.',
            'Nothing in these terms excludes the publisher’s liability for wilful misconduct or gross negligence, nor the rights that the law mandatorily grants to consumers.',
          ],
        },
        {
          title: '7. Intellectual property',
          body: [
            `The application’s source code is published under the MIT license; the name, logo and icon remain the property of ${PUBLISHER} (see the legal notice). The publisher grants you a personal, non-exclusive, non-transferable right to use the service.`,
            'The URLs you create with the service belong to you.',
          ],
        },
        {
          title: '8. Personal data',
          body: ['The service does not collect any personal data. Details on local storage and hosting are in the legal notice.'],
        },
        {
          title: '9. Changes to these terms',
          body: ['The publisher may amend these terms at any time. The version in force is the one published on this page, with its update date. Continuing to use the service after a change constitutes acceptance.'],
        },
        {
          title: '10. Governing law and disputes',
          body: [
            'These terms are governed by French law. In the event of a dispute, an amicable solution will be sought first (contact: see the legal notice). Failing that, and subject to mandatory consumer protection rules, French courts have jurisdiction.',
          ],
        },
      ],
    },
  },
}

export const copyright = (year = new Date().getFullYear()) =>
  `© ${year > COPYRIGHT_FROM ? `${COPYRIGHT_FROM}–${year}` : COPYRIGHT_FROM} ${PUBLISHER}`
