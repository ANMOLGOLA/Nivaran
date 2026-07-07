#!/bin/bash
# Smart Bharat Deployment Script
# ─────────────────────────────────────────────────────
# Usage: ./deploy.sh [firebase-project-id] [gcp-project-id]
# Example: ./deploy.sh smart-bharat-demo smart-bharat-prod

FIREBASE_PROJECT=${1:-"smart-bharat-demo"}
GCP_PROJECT=${2:-"smart-bharat-demo"}
REGION="asia-south1"
SERVICE_NAME="smart-bharat-api"

echo "🚀 Smart Bharat Deployment"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

echo ""
echo "📦 Step 1: Building frontend..."
cd frontend
npm run build
echo "✅ Frontend built to dist/"

echo ""
echo "🔥 Step 2: Deploying to Firebase Hosting..."
npx firebase-tools deploy --only hosting --project $FIREBASE_PROJECT
echo "✅ Frontend deployed!"

echo ""
echo "🐳 Step 3: Building backend Docker image..."
cd ../backend
npm run build
echo "✅ Backend compiled to dist/"

echo ""
echo "☁️  Step 4: Deploying backend to Cloud Run (${REGION})..."
gcloud run deploy $SERVICE_NAME \
  --source . \
  --region $REGION \
  --project $GCP_PROJECT \
  --allow-unauthenticated \
  --set-env-vars="NODE_ENV=production,GEMINI_API_KEY=${GEMINI_API_KEY}" \
  --memory 512Mi \
  --min-instances 0 \
  --max-instances 5

echo ""
echo "✅ All deployed successfully!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🌐 Frontend: https://${FIREBASE_PROJECT}.web.app"
echo "🔌 Backend:  https://${SERVICE_NAME}-<hash>-${REGION}.a.run.app"
