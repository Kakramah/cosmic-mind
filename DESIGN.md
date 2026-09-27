# بطاقة تصميم — هل في عقل الإنسان سرّ خلافته في الأرض؟

النوع: قصة

## بطاقة الهوية

| الحقل | القيمة | السبب |
|---|---|---|
| المكان | الكون — لا مدينة | النص عن الأرض كذرة في الكون |
| الزمان | خارج الزمن | تأمل فلسفي مطلق |
| الطبيعة | تأمل فلسفي | ليس رثاءً ولا مساءلة ولا احتفاءً |
| الشعور المهيمن | دهشة هادئة | الوقوف أمام مفارقة الضآلة والعظمة |
| الأسلوب | جديد — تأمل كوني | لا أسلوب في البنك صُمم لهذا الموضوع |
| العائلة الخطية | Amiri (عناوين وبيت شعري) · Cairo (متن) | Amiri نسخ أدبي يليق بالاقتباس، Cairo يُقرأ بسلاسة |
| معالجة العقاب | `dark` · عرض 48px · شفافية 0.35 | النص شخصي تأملي لا سيادي؛ حضور هادئ |

## التوكنات

```css
:root {
  --color-bg-deep:       #06090f;
  --color-bg-surface:    #0c1018;
  --color-bg-card:       #111827;
  --color-hero:          #c9a557;
  --color-hero-muted:    #a08240;
  --color-text-primary:  #e0dcd4;
  --color-text-secondary:#9b968c;
  --color-text-dim:      #5a564e;
  --color-nebula-blue:   rgba(25, 58, 92, 0.4);
  --color-nebula-amber:  rgba(100, 60, 20, 0.15);
  --color-divider:       rgba(201, 165, 87, 0.12);
  --font-display: 'Amiri', 'Noto Naskh Arabic', serif;
  --font-body:    'Cairo', 'Noto Naskh Arabic', sans-serif;
  --transition-reveal: 1.2s cubic-bezier(0.22, 1, 0.36, 1);
  --space-section: clamp(4rem, 12vh, 8rem);
}
```

## الشبكة
تصميم سردي متوازن بشبكة متجاوبة تصل إلى 960px في المشاهد المزدوجة، والنص يتنفس في فراغ كوني مهيب.

## الحركة
- ظهور سلس عند التمرير (Scroll Reveal)
- حقل نجوم Canvas حي يتلألأ بلطف
- سديم كوني بطبقتين مع إزاحة Parallax ناعمة
- شريط تقدم ذهبي دقيق في أعلى الصفحة
- مؤشر تأمل وتمرير نبضي في الافتتاحية
- نافذة عرض مكبرة (Lightbox) مع تنقل بالأسهم
- دعم كامل لـ `prefers-reduced-motion`

## الملمس
ضجيج خفيف سينمائي (film grain) بشفافية 3%.

## جرد الأصول

| الأصل | المصدر | الحالة |
|---|---|---|
| العقاب | `~/khaldoun-brand/eagle/eagle-emblem-metal.svg` | ✓ معدني 48px |
| Amiri Regular + Bold | aliftype/amiri · SIL OFL | ✓ woff2 محلي |
| Cairo Variable | google/fonts · SIL OFL | ✓ woff2 محلي |
| `images/slide-01.jpg` | توليد بصري: نقطة ضوء الأرض في السديم العميق | ✓ محسن < 500KB |
| `images/slide-02.jpg` | توليد بصري: وقفة الكائن البشري أمام مجرة درب التبانة | ✓ محسن < 500KB |
| `images/slide-03.jpg` | توليد بصري: يد العقل البشري تسبر نواميس الكون | ✓ محسن < 500KB |
| `images/slide-04.jpg` | توليد بصري: تجلي الكون وانطواؤه في باطن الإنسان | ✓ محسن < 500KB |
