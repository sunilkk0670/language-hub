import 'package:flutter/material.dart';
import '../widgets/markdown_viewer.dart';

class CompliancePage extends StatelessWidget {
  final int initialIndex;

  const CompliancePage({
    super.key,
    this.initialIndex = 0,
  });

  @override
  Widget build(BuildContext context) {
    return DefaultTabController(
      length: 3,
      initialIndex: initialIndex,
      child: Scaffold(
        appBar: AppBar(
          title: const Text('Legal Compliance'),
          bottom: const TabBar(
            tabs: [
              Tab(text: 'Privacy Policy'),
              Tab(text: 'Terms of Service'),
              Tab(text: 'Refund Policy'),
            ],
            indicatorColor: Color(0xFF6A4CBC),
            labelColor: Color(0xFF6A4CBC),
            unselectedLabelColor: Colors.grey,
          ),
        ),
        body: const TabBarView(
          children: [
            MarkdownViewer(assetPath: 'assets/legal/privacy_policy.md'),
            MarkdownViewer(assetPath: 'assets/legal/terms_of_service.md'),
            MarkdownViewer(assetPath: 'assets/legal/refund_policy.md'),
          ],
        ),
      ),
    );
  }
}
