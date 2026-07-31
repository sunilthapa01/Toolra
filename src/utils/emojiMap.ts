export const EMOJI_MAP: Record<string, string> = {
  'rocket': '🚀',
  'check': '✅',
  'white_check_mark': '✅',
  'x': '❌',
  'warning': '⚠️',
  'fire': '🔥',
  'star': '⭐',
  'sparkles': '✨',
  'heart': '❤️',
  'smile': '😄',
  'tada': '🎉',
  'memo': '📝',
  'pencil': '📝',
  'bug': '🐛',
  'zap': '⚡',
  'bulb': '💡',
  'gear': '⚙️',
  'link': '🔗',
  'lock': '🔒',
  'key': '🔑',
  'eyes': '👀',
  'thumbsup': '👍',
  '+1': '👍',
  'thumbsdown': '👎',
  '-1': '👎',
  'clap': '👏',
  '100': '💯',
  'art': '🎨',
  'code': '💻',
  'wrench': '🔧',
  'package': '📦',
  'hammer': '🔨',
  'earth_americas': '🌎',
  'globe': '🌐',
  'book': '📖',
  'bookmark': '🔖',
  'triangular_flag_on_post': '🚩',
  'pin': '📌',
  'calendar': '📅',
  'chart_with_upwards_trend': '📈'
};

export function parseEmojiShortcodes(markdown: string): string {
  if (!markdown) return markdown;
  return markdown.replace(/:([a-z0-9_+-]+):/gi, (match, shortcode) => {
    const key = shortcode.toLowerCase();
    return EMOJI_MAP[key] || match;
  });
}
