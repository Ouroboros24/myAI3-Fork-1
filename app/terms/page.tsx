import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { OWNER_NAME, AI_NAME } from "@/config";

export default function Terms() {
    return (
        <div className="relative min-h-screen w-full overflow-hidden bg-background text-foreground font-sans">
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute -top-32 left-10 h-[320px] w-[320px] rounded-full bg-cyan-400/25 blur-[160px]" />
                <div className="absolute top-1/3 right-10 h-[240px] w-[240px] rounded-full bg-fuchsia-500/20 blur-[140px]" />
                <div className="absolute bottom-[-120px] left-1/2 h-[480px] w-[480px] -translate-x-1/2 rounded-full bg-indigo-600/20 blur-[220px]" />
            </div>
            <div className="relative w-full flex justify-center p-10">
                <div className="w-full max-w-screen-md space-y-8 neon-grid">
                    <Link
                        href="/"
                        className="group flex items-center gap-2 text-primary hover:text-primary/80 transition-colors duration-200"
                    >
                        <ArrowLeftIcon className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        <span className="uppercase tracking-[0.15em] text-sm">Return to Terminal</span>
                    </Link>
                    
                    <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-secondary/60 via-secondary/40 to-transparent p-8 backdrop-blur-2xl shadow-[0_0_45px_rgba(15,23,42,0.6)]">
                        <div className="mb-6 flex items-center gap-3 text-xs uppercase tracking-[0.35em] text-primary">
                            <span className="h-px flex-1 bg-primary/30" aria-hidden="true" />
                            LEGAL PROTOCOL
                            <span className="h-px flex-1 bg-primary/30" aria-hidden="true" />
                        </div>
                        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary via-fuchsia-400 to-primary bg-clip-text text-transparent">
                            {AI_NAME}
                        </h1>
                        <h2 className="text-2xl font-semibold text-foreground mb-6">Terms of Use / Disclaimer</h2>

                        <p className="text-foreground/90 leading-relaxed mb-8">
                            The following terms of use govern access to and use of {AI_NAME}
                            (&quot;AI Assistant&quot;), an artificial intelligence-powered gaming recommendation
                            service provided by {OWNER_NAME} (&quot;I&quot;, &quot;me&quot;, or &quot;myself&quot;). By engaging with {AI_NAME},
                            you agree to these terms. If you do not agree, you may not use the service.
                        </p>

                        <div className="space-y-6">
                            <div className="space-y-4">
                                <h3 className="text-xl font-semibold text-primary uppercase tracking-wide">Service Overview</h3>
                                <ol className="list-decimal list-inside space-y-4">
                                    <li className="text-foreground/90 leading-relaxed">
                                        <span className="font-semibold text-primary">Provider and Purpose:</span> {AI_NAME} is a
                                        gaming recommendation assistant developed and maintained by {OWNER_NAME}. The service
                                        is designed to provide personalized gaming recommendations based on publicly available
                                        data, including game reviews, ratings, genres, platforms, and other publicly accessible
                                        gaming information. {AI_NAME} is not affiliated with, endorsed by, or operated by any
                                        game developers, publishers, or gaming platforms.
                                    </li>
                                    <li className="text-foreground/90 leading-relaxed">
                                        <span className="font-semibold text-primary">Data Sources:</span> {AI_NAME} generates
                                        recommendations using publicly available data from various sources, including but not
                                        limited to game databases, review aggregators, public forums, and other open gaming
                                        information repositories. The service does not access private user accounts, purchase
                                        history, or any non-public personal gaming data unless explicitly provided by you
                                        during your interaction.
                                    </li>
                                    <li className="text-foreground/90 leading-relaxed">
                                        <span className="font-semibold text-primary">Third-Party Involvement:</span> {AI_NAME}
                                        utilizes multiple third-party platforms and vendors, some of which operate outside
                                        the United States. Your inputs may be transmitted, processed, and stored by these
                                        third-party systems. As such, confidentiality, security, and privacy cannot be
                                        guaranteed, and data transmission may be inherently insecure and subject to interception.
                                    </li>
                                    <li className="text-foreground/90 leading-relaxed">
                                        <span className="font-semibold text-primary">No Guarantee of Accuracy:</span> {AI_NAME}
                                        is designed to provide helpful and relevant gaming recommendations but may deliver
                                        inaccurate, incomplete, or outdated information. Game availability, pricing, ratings,
                                        and other details may change over time. Users are strongly encouraged to independently
                                        verify any information, including checking current game prices, availability, and
                                        system requirements before making purchasing decisions.
                                    </li>
                                </ol>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-xl font-semibold text-primary uppercase tracking-wide">Liability</h3>
                                <ol className="list-decimal list-inside space-y-4">
                                    <li className="text-foreground/90 leading-relaxed">
                                        <span className="font-semibold text-primary">Use at Your Own Risk:</span> {AI_NAME}
                                        is provided on an &quot;as-is&quot; and &quot;as-available&quot; basis. To the fullest extent
                                        permitted by law:
                                        <ul className="list-disc list-inside ml-6 mt-2 space-y-2 text-foreground/80">
                                            <li>
                                                {OWNER_NAME} disclaims all warranties, express or implied, including but
                                                not limited to warranties of merchantability, fitness for a particular purpose,
                                                and non-infringement.
                                            </li>
                                            <li>
                                                {OWNER_NAME} is not liable for any errors, inaccuracies, or omissions in
                                                the gaming recommendations or information provided by {AI_NAME}.
                                            </li>
                                            <li>
                                                {OWNER_NAME} is not responsible for the quality, performance, or content of
                                                any games recommended by {AI_NAME}, nor for any purchases made based on
                                                such recommendations.
                                            </li>
                                        </ul>
                                    </li>
                                    <li className="text-foreground/90 leading-relaxed">
                                        <span className="font-semibold text-primary">No Responsibility for Damages:</span>{" "}
                                        Under no circumstances shall {OWNER_NAME}, his collaborators, partners, affiliated
                                        entities, or representatives be liable for any direct, indirect, incidental,
                                        consequential, special, or punitive damages arising out of or in connection with
                                        the use of {AI_NAME}, including but not limited to dissatisfaction with recommended
                                        games, financial losses from game purchases, or any issues arising from playing
                                        recommended games.
                                    </li>
                                    <li className="text-foreground/90 leading-relaxed">
                                        <span className="font-semibold text-primary">Modification or Discontinuation:</span>{" "}
                                        I reserve the right to modify, suspend, or discontinue {AI_NAME}&apos;s functionalities
                                        at any time without notice.
                                    </li>
                                    <li className="text-foreground/90 leading-relaxed">
                                        <span className="font-semibold text-primary">Future Fees:</span> While {AI_NAME} is
                                        currently provided free of charge, I reserve the right to implement a fee for its
                                        use at any time.
                                    </li>
                                </ol>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-xl font-semibold text-primary uppercase tracking-wide">User Responsibilities</h3>
                                <ol className="list-decimal list-inside space-y-4">
                                    <li className="text-foreground/90 leading-relaxed">
                                        <span className="font-semibold text-primary">Eligibility:</span> Use of {AI_NAME} is
                                        restricted to individuals aged 18 or older. Users under 18 should not use this
                                        service without parental supervision.
                                    </li>
                                    <li className="text-foreground/90 leading-relaxed">
                                        <span className="font-semibold text-primary">Prohibited Conduct:</span> By using {AI_NAME},
                                        you agree not to:
                                        <ul className="list-disc list-inside ml-6 mt-2 space-y-2 text-foreground/80">
                                            <li>Post or transmit content that is defamatory, offensive, intimidating, illegal,
                                                racist, discriminatory, obscene, or otherwise inappropriate.</li>
                                            <li>Use {AI_NAME} to engage in unlawful or unethical activities.</li>
                                            <li>Attempt to compromise the security or functionality of {AI_NAME}.</li>
                                            <li>Copy, distribute, modify, reverse engineer, decompile, or extract the source
                                                code of {AI_NAME} without explicit written consent.</li>
                                            <li>Use {AI_NAME} to generate recommendations for illegal or harmful content.</li>
                                        </ul>
                                    </li>
                                </ol>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-xl font-semibold text-primary uppercase tracking-wide">Data Privacy and Security</h3>
                                <ol className="list-decimal list-inside space-y-4">
                                    <li className="text-foreground/90 leading-relaxed">
                                        <span className="font-semibold text-primary">No Privacy Guarantee:</span> {AI_NAME}
                                        does not guarantee privacy, confidentiality, or security of the information you
                                        provide. Conversations, gaming preferences, and any personal information you share
                                        may be reviewed by {OWNER_NAME}, collaborators, partners, or affiliated entities
                                        for purposes such as improving {AI_NAME}, enhancing recommendation algorithms, and
                                        conducting research.
                                    </li>
                                    <li className="text-foreground/90 leading-relaxed">
                                        <span className="font-semibold text-primary">Public Information:</span> Any
                                        information you provide through {AI_NAME}, including gaming preferences, favorite
                                        genres, platform preferences, and other details, is treated as public and may be
                                        used for service improvement and research purposes.
                                    </li>
                                    <li className="text-foreground/90 leading-relaxed">
                                        <span className="font-semibold text-primary">Data Transmission:</span> Inputs,
                                        preferences, and conversation data may be transmitted to and processed by
                                        third-party services, including AI model providers and data processing platforms.
                                    </li>
                                    <li className="text-foreground/90 leading-relaxed">
                                        <span className="font-semibold text-primary">Gaming Data:</span> {AI_NAME} uses
                                        publicly available gaming data to generate recommendations. We do not access your
                                        private gaming accounts, purchase history, or any non-public gaming data unless
                                        you explicitly provide such information during your interaction.
                                    </li>
                                </ol>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-xl font-semibold text-primary uppercase tracking-wide">Ownership of Content and Commercial Use</h3>
                                <ol className="list-decimal list-inside space-y-4">
                                    <li className="text-foreground/90 leading-relaxed">
                                        <span className="font-semibold text-primary">Surrender of Rights:</span> By using {AI_NAME},
                                        you irrevocably assign and surrender all rights, title, interest, and intellectual
                                        property rights in any content, inputs you provide, and outputs generated by {AI_NAME}
                                        to {OWNER_NAME}. This includes, but is not limited to, text, questions, conversations,
                                        gaming preferences, and recommendation feedback.
                                    </li>
                                    <li className="text-foreground/90 leading-relaxed">
                                        <span className="font-semibold text-primary">Commercial and Research Use:</span>{" "}
                                        {OWNER_NAME} reserves the right to use any input provided by users and any output
                                        generated by {AI_NAME} for commercial purposes, research, algorithm improvement, or
                                        other activities without compensation or notification to users.
                                    </li>
                                    <li className="text-foreground/90 leading-relaxed">
                                        <span className="font-semibold text-primary">No Claim to Gains or Profits:</span>{" "}
                                        Users agree that they have no rights, claims, or entitlement to any gains, profits,
                                        or benefits derived from the use or exploitation of the content provided to {AI_NAME}
                                        or the recommendations generated by the service.
                                    </li>
                                </ol>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-xl font-semibold text-primary uppercase tracking-wide">Indemnification</h3>
                                <p className="text-foreground/90 leading-relaxed">
                                    By using {AI_NAME}, you agree to indemnify and hold harmless {OWNER_NAME}, his
                                    collaborators, partners, affiliated entities, and representatives from any claims,
                                    damages, losses, or liabilities arising out of your use of {AI_NAME} or violation of
                                    these terms, including but not limited to any issues arising from games recommended
                                    by the service.
                                </p>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-xl font-semibold text-primary uppercase tracking-wide">Governing Law and Jurisdiction</h3>
                                <p className="text-foreground/90 leading-relaxed">
                                    These terms are governed by the laws of the State of North Carolina, United States.
                                    Additional jurisdictions may apply for users outside the United States, subject to
                                    applicable local laws. In case of conflicts, the laws of North Carolina shall prevail
                                    to the extent permissible. Any disputes arising under or in connection with these
                                    terms shall be subject to the exclusive jurisdiction of the courts located in North
                                    Carolina.
                                </p>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-xl font-semibold text-primary uppercase tracking-wide">Acceptance of Terms</h3>
                                <p className="text-foreground/90 leading-relaxed">
                                    By using {AI_NAME}, you confirm that you have read, understood, and agreed to these
                                    Terms of Use and Disclaimer. If you do not agree with any part of these terms, you
                                    may not use {AI_NAME}.
                                </p>
                            </div>

                            <div className="mt-8 pt-6 border-t border-white/10">
                                <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                                    Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}