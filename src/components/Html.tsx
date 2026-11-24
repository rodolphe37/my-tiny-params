import { useI18n, type Key, type Vars } from '../i18n'

/**
 * Texte traduit contenant un peu de balisage (<b>, <code>, <em>…). Les chaînes viennent de src/i18n (constantes) ;
 * les seules variables injectées sont le nom du paramètre court, validé (lettres, chiffres, - et _) avant d'arriver ici.
 */
export function Html({ k, vars, as: Tag = 'span' }: { k: Key; vars?: Vars; as?: 'span' | 'p' | 'li' }) {
  const { t } = useI18n()
  return <Tag dangerouslySetInnerHTML={{ __html: t(k, vars) }} />
}
